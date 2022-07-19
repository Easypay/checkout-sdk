import dialogPolyfill from 'dialog-polyfill'
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import dialogCss from 'dialog-polyfill/dist/dialog-polyfill.css'
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import epcsdkCss from '../src/assets/epcsdk.css'

import { version } from '../package.json'
/**
 * Represents the object returned by the Checkout creation API call.
 * @see https://api.prod.easypay.pt/docs#tag/Checkout/paths/~1checkout/post
 */
export interface CheckoutManifest {
  id: string
  session: string
  config: null | {
    language?: string
    logoUrl?: string
    hideDetails?: boolean
    allowClose?: boolean
    sdkVersion?: string
  }
}

/** Represents information sent when the Checkout process succeeds. */
export interface CheckoutPaymentInfo {
  /** Whether the payment was completed (for synchronous payment methods) or just requested (for asynchronous ones). */
  paid: boolean
}

/** Represents an error that happened during a Checkout session. */
export interface CheckoutError {
  /** The error code. One of 'checkout-expired', 'already-paid', 'checkout-canceled' or 'generic-error'. */
  code: string
}

/**
 * The possible options to configure the Checkout SDK.
 */
export interface CheckoutOptions {
  /** The id of the HTML element where the Checkout should be inserted. */
  id?: string
  /** The callback to call on Checkout successful completion. */
  onSuccess?: (paymentInfo: CheckoutPaymentInfo) => void
  /** The callback to call on Checkout errors. */
  onError?: (error: CheckoutError) => void
  /** The callback to call on Checkout cancel */
  onClose?: () => void
  /** Whether the SDK should use testing APIs. */
  testing?: boolean
  /** Wether the Checkout should be a popup or an inline element  */
  display?: string
  /** Wether the Checkout should have the customer details form hidden */
  hideDetails?: boolean
  /** Which language should the Checkout be displayed in*/
  language?: string
  /** The logo url of the merchant */
  logoUrl?: string
}

/**
 * The default values for all the options.
 */
const defaultOptions: CheckoutOptions = {
  id: 'easypay-checkout',
  onSuccess: () => {
    /* do nothing */
  },
  onError: () => {
    /* do nothing */
  },
  testing: false,
  display: 'inline',
  hideDetails: false,
  language: '',
  logoUrl: '',
}

/**
 * Encapsulates a Checkout instance created by startCheckout.
 * Stores useful parameters and allows cleanup when unmount() is called.
 */
export class CheckoutInstance {
  private static PROD_URL = 'https://pay.easypay.pt'
  private static TEST_URL = 'https://pay.sandbox.easypay.pt'
  private static LOGTAG = '[easypay Checkout SDK]'

  private options: CheckoutOptions
  private dialog: HTMLElement | null = null
  private style: HTMLElement | null = null
  private hostElement: HTMLElement | null = null
  private originUrl = CheckoutInstance.PROD_URL
  private messageHandler: ((e: MessageEvent) => void) | null = null
  private clickHandler: ((e: MouseEvent) => void) | null = null
  /**
   * The class constructor. Sets up the iframe contents and event listener.
   */
  constructor(private manifest: CheckoutManifest, private givenOptions: CheckoutOptions) {
    this.options = { ...defaultOptions, ...givenOptions }

    if (!this.validateParameters(manifest, this.options)) {
      return
    }

    this.mapOptionsToManifest(manifest, this.options)
    manifest.config!.sdkVersion = version

    if (this.options.testing) {
      this.originUrl = CheckoutInstance.TEST_URL
    }

    this.messageHandler = this.handleMessage.bind(this)

    window.addEventListener('message', this.messageHandler)

    // Creating iframe
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', `${this.originUrl}?manifest=${this.encodeManifest(manifest)}`)
    // Using the attributes below in order to provide defaults without overriding CSS styles.
    iframe.setAttribute('width', '400')
    iframe.setAttribute('height', '700')
    iframe.setAttribute('frameborder', '0')

    this.hostElement = document.getElementById(this.options.id!)!

    if (this.options.display === 'popup') {
      // Draw the Popup
      if (this.hostElement !== null) {
        this.createPopupDOMTree(iframe)
        this.clickHandler = this.handleClick.bind(this)
      }

      this.hostElement.addEventListener('click', this.clickHandler!)
    } else {
      this.hostElement?.appendChild(iframe)
    }
  }

  private mapOptionsToManifest(manifest: CheckoutManifest, options: CheckoutOptions) {
    const { hideDetails, language, logoUrl, display } = options
    if (!manifest.config) {
      manifest.config = {}
    }
    if (hideDetails) {
      manifest.config!.hideDetails = hideDetails
    }
    if (language) {
      manifest.config!.language = language
    }
    if (logoUrl) {
      manifest.config!.logoUrl = logoUrl
    }
    if (display === 'popup') {
      manifest.config!.allowClose = true
    }
    if (display === 'inline') {
      manifest.config!.allowClose = false
    }
  }

  /**
   * Validates the necessary parameters for Checkout initialization and gives helpful messages for integrators.
   */
  private validateParameters(manifest: CheckoutManifest, options: CheckoutOptions) {
    if (
      !manifest ||
      typeof manifest.id !== 'string' ||
      manifest.id === '' ||
      typeof manifest.session !== 'string' ||
      manifest.session === ''
    ) {
      console.error(
        `${CheckoutInstance.LOGTAG} Please provide a valid Checkout Manifest when calling startCheckout.`
      )
      return false
    }
    if (typeof options.id !== 'string' || options.id === '') {
      console.error(`${CheckoutInstance.LOGTAG} The HTML element id must be a non-empty string.`)
      return false
    }
    const el = document.getElementById(options.id!)
    if (!el) {
      console.error(`${CheckoutInstance.LOGTAG} Could not find element ${options.id}.`)
      return false
    }
    if (typeof options.onSuccess !== 'function') {
      console.error(`${CheckoutInstance.LOGTAG} The onSuccess callback must be a function.`)
      return false
    }
    if (typeof options.onError !== 'function') {
      console.error(`${CheckoutInstance.LOGTAG} The onError callback must be a function.`)
      return false
    }
    if (!!options.onClose && typeof options.onClose !== 'function') {
      console.error(`${CheckoutInstance.LOGTAG} The onClose callback must be a function.`)
      return false
    }
    if (!!options.onClose && options.display === 'inline') {
      console.error(
        `${CheckoutInstance.LOGTAG} The onClose callback can only be used with display popup.`
      )
      return false
    }
    if (typeof options.testing !== 'boolean') {
      console.error(`${CheckoutInstance.LOGTAG} The testing option must be true or false.`)
      return false
    }
    if (typeof options.display !== 'string' || !['inline', 'popup'].includes(options.display)) {
      console.error(`${CheckoutInstance.LOGTAG} The display option must be 'inline' or 'popup'.`)
      return false
    }
    if (typeof options.hideDetails !== 'boolean') {
      console.error(`${CheckoutInstance.LOGTAG} The hideDetails option must be true or false.`)
      return false
    }
    if (typeof options.language !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The language option must be a string.`)
      return false
    }
    if (typeof options.logoUrl !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The logoUrl option must be a string.`)
      return false
    }
    return true
  }

  /**
   * Encodes a Manifest for iframe consumption. Supports both Node and browser environments.
   */
  private encodeManifest(manifest: CheckoutManifest) {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(JSON.stringify(manifest), 'binary').toString('base64')
    } else {
      return window.btoa(JSON.stringify(manifest))
    }
  }

  /**
   * Handles messages sent from the Checkout iframe. If the origin and contents are as expected,
   * pass them on to the event handlers that were configured in startCheckout.
   *
   * If the Checkout becomes finished successfuly, automatically removes the event listener.
   * If the Checkout gets an error or if it is closed, the event listerner is not removed.
   */
  private handleMessage(e: MessageEvent) {
    if (e.origin === this.originUrl && e.data.type === 'ep-checkout') {
      if (e.data.status === 'close' && this.options.onClose) {
        if (this.dialog) {
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          this.dialog.close()
        }
        this.options.onClose()
      }

      if (e.data.status === 'success') {
        this.options.onSuccess!(e.data.payment)
        if (this.messageHandler) {
          window.removeEventListener('message', this.messageHandler)
        }
      } else if (e.data.status === 'error') {
        this.options.onError!(e.data.error)
      }
    }
  }

  private handleClick() {
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    this.dialog.showModal()
  }

  /**
   * Creates popup modal in the DOM to host the Checkout iframe.
   *
   * If the user clicks close on Checkout, automatically closes the popup.
   */
  private createPopupDOMTree(iframe: HTMLIFrameElement) {
    // Div Tree
    const dialog = document.createElement('dialog')
    const dialogBody = document.createElement('div')

    // Style element
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')

    // Using polyfill if necessary
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    if (typeof dialog.showModal !== 'function') {
      style.appendChild(document.createTextNode(dialogCss))

      dialogPolyfill.registerDialog(dialog)
    }

    // Apply style
    style.appendChild(document.createTextNode(epcsdkCss))
    document.head.appendChild(style)

    // Set Attributes
    dialog.setAttribute('class', 'epcsdk-modal')

    // Body content
    dialogBody.appendChild(iframe)
    dialog.appendChild(dialogBody)

    // Mount to the end of body
    document.body.appendChild(dialog)

    // Elements created on popup mode
    this.dialog = dialog
    this.style = style
  }

  /**
   * Used to cleanup Checkout by removing the DOM contents and event listener.
   */
  unmount() {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler)
    }

    if (this.clickHandler) {
      this.hostElement?.removeEventListener('click', this.clickHandler)
    }

    if (this.dialog) {
      this.dialog.remove()
      this.style?.remove()
    }
    const children = Array.from(document.getElementById(this.options.id!)?.children || [])
    children.map((child) => {
      child.remove()
    })
  }
}

/**
 * Used to configure and populate the Checkout form.
 *
 * Returns an instance of the CheckoutInstance class, which can be used to manage
 * the running Checkout (in particular, to unmount it).
 */
export function startCheckout(manifest: CheckoutManifest, options: CheckoutOptions = {}) {
  return new CheckoutInstance(manifest, options)
}
