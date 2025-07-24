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
    backgroundColor?: string
    accentColor?: string
    errorColor?: string
    inputBackgroundColor?: string
    inputBorderColor?: string
    inputBorderRadius?: number
    inputFloatingLabel?: boolean
    buttonBackgroundColor?: string
    buttonBorderRadius?: number
    buttonBoxShadow?: boolean
    fontFamily?: string
    baseFontSize?: number
  }
}

/** The possible types of Checkout payments. */
export type CheckoutType = 'single' | 'frequent' | 'subscription'

/** The possible payment methods. */
export type CheckoutMethod = 'cc' | 'mbw' | 'mb' | 'dd' | 'vi' | 'ap' | 'gp' | 'sw'

/** The possible payment status values. */
export type PaymentStatus =
  | 'authorised'
  | 'deleted'
  | 'enrolled'
  | 'error'
  | 'failed'
  | 'paid'
  | 'pending'
  | 'success'
  | 'tokenized'
  | 'voided'

/** Represents information sent when the Checkout process succeeds. */
export interface CheckoutOutput {
  /** The Checkout session's id. */
  id: string
  /** The Checkout payment type. */
  type: CheckoutType
  /** Information about the payment. */
  payment: {
    /** The payment's id. */
    id: string
    /** The chosen payment method. */
    method: CheckoutMethod
    /** The status of the payment. */
    status: PaymentStatus
    /** How much is being paid. Not used in frequent payments. */
    value?: number
    /** Multibanco entity. Not used in other methods. */
    entity?: string
    /** Multibanco reference. Not used in other methods. */
    reference?: string
    /** Multibanco expiration date. Not used in other methods. */
    expirationDate?: string
    /** SEPA Direct Debit mandate. Used only in Direct Debit. */
    sddMandate?: {
      /** Name of the account holder. */
      accountHolder: string
      /** The billing entity for the payments. */
      billingEntity: string
      /** Country code prefix to the phone number. */
      countryCode: string
      /** The customer's e-mail address. */
      email: string
      /** The IBAN. */
      iban: string
      /** The mandate's ID. */
      id: string
      /** The maximum number of debits allowed for this Direct Debit. */
      maxNumDebits: string
      /** The customer's name. May be different from the account holder's name. */
      name: string
      /** The customer's phone number. */
      phone: string
      /** The authorization reference. */
      referenceAdc: string
    }
  }
}

/** Represents an error that happened during a Checkout session. */
export interface CheckoutError {
  /** The error code. */
  code: 'checkout-expired' | 'already-paid' | 'checkout-canceled' | 'generic-error'
}

/** Represents a payment error that happened during a Checkout session. */
export interface CheckoutPaymentError {
  /** The error code. */
  code: 'payment-failure' | 'generic-error'
  /** The payment method for which the error happened.  */
  paymentMethod: CheckoutMethod
  /** On `payment-failure` errors, the Checkout that had already been created. */
  checkout?: CheckoutOutput
}

/**
 * The possible options to configure the Checkout SDK.
 */
export interface CheckoutOptions {
  /** The id of the HTML element where the Checkout should be inserted. */
  id?: string
  /** The callback to call on Checkout successful completion. */
  onSuccess?: (successInfo: CheckoutOutput) => void
  /** The callback to call on Checkout errors. */
  onError?: (error: CheckoutError) => void
  /** The callback to call on Payment errors. */
  onPaymentError?: (error: CheckoutPaymentError) => void
  /** The callback to call on Checkout close. */
  onClose?: () => void
  /** Whether the SDK should use testing APIs. */
  testing?: boolean
  /** The Checkout iframe URL which to include. Used to debug only. Will override the testing URL. */
  iframeUrl?: string
  /** Wether the Checkout should be a popup or an inline element  */
  display?: string
  /** Wether the Checkout should have the customer details form hidden */
  hideDetails?: boolean
  /** Which language should the Checkout be displayed in*/
  language?: string
  /** The logo url of the merchant */
  logoUrl?: string
  /** The background color of the iframe */
  backgroundColor?: string
  /** The accent color of the checkout */
  accentColor?: string
  /** The error color of the checkout */
  errorColor?: string
  /** The checkout inputs background color  */
  inputBackgroundColor?: string
  /** The checkout inputs border color  */
  inputBorderColor?: string
  /** The checkout inputs border radius  */
  inputBorderRadius?: number
  /** The checkout inputs floating label  */
  inputFloatingLabel?: boolean
  /** The checkout buttons background color */
  buttonBackgroundColor?: string
  /** The checkout buttons border radius */
  buttonBorderRadius?: number
  /** The checkout buttons box shadow */
  buttonBoxShadow?: boolean
  /** The checkout font family text*/
  fontFamily?: string
  /** The checkout font size text*/
  baseFontSize?: number
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
  onPaymentError: () => {
    /* do nothing */
  },
  testing: false,
  iframeUrl: '',
  display: 'inline',
  hideDetails: false,
  language: '',
  logoUrl: '',
  backgroundColor: 'white',
  accentColor: '',
  errorColor: '',
  inputBackgroundColor: '',
  inputBorderColor: '',
  inputBorderRadius: undefined,
  inputFloatingLabel: true,
  buttonBackgroundColor: '',
  buttonBorderRadius: undefined,
  buttonBoxShadow: true,
  fontFamily: '',
  baseFontSize: undefined,
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
  private successfulPaymentInteraction = false

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

    if (this.options.iframeUrl) {
      this.originUrl = this.options.iframeUrl
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
    iframe.setAttribute('allow', 'payment')
    iframe.style.maxWidth = '100%'
    if (this.options.backgroundColor) {
      iframe.style.backgroundColor = this.options.backgroundColor
    }

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
    const {
      hideDetails,
      language,
      logoUrl,
      display,
      backgroundColor,
      accentColor,
      errorColor,
      inputBackgroundColor,
      inputBorderColor,
      inputBorderRadius,
      inputFloatingLabel,
      buttonBackgroundColor,
      buttonBorderRadius,
      buttonBoxShadow,
      fontFamily,
      baseFontSize,
    } = options
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
    if (backgroundColor) {
      manifest.config!.backgroundColor = backgroundColor
    }
    if (accentColor) {
      manifest.config!.accentColor = accentColor
    }
    if (errorColor) {
      manifest.config!.errorColor = errorColor
    }
    if (inputBackgroundColor) {
      manifest.config!.inputBackgroundColor = inputBackgroundColor
    }
    if (inputBorderColor) {
      manifest.config!.inputBorderColor = inputBorderColor
    }
    if (inputBorderRadius !== undefined) {
      manifest.config!.inputBorderRadius = inputBorderRadius
    }
    if (inputFloatingLabel !== undefined) {
      manifest.config!.inputFloatingLabel = inputFloatingLabel
    }
    if (buttonBackgroundColor) {
      manifest.config!.buttonBackgroundColor = buttonBackgroundColor
    }
    if (buttonBorderRadius !== undefined) {
      manifest.config!.buttonBorderRadius = buttonBorderRadius
    }
    if (buttonBoxShadow !== undefined) {
      manifest.config!.buttonBoxShadow = buttonBoxShadow
    }
    if (fontFamily) {
      manifest.config!.fontFamily = fontFamily
    }
    if (baseFontSize) {
      manifest.config!.baseFontSize = baseFontSize
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
    if (typeof options.onPaymentError !== 'function') {
      console.error(`${CheckoutInstance.LOGTAG} The onPaymentError callback must be a function.`)
      return false
    }
    if (!!options.onClose && typeof options.onClose !== 'function') {
      console.error(`${CheckoutInstance.LOGTAG} The onClose callback must be a function.`)
      return false
    }
    if (typeof options.testing !== 'boolean') {
      console.error(`${CheckoutInstance.LOGTAG} The testing option must be true or false.`)
      return false
    }
    if (typeof options.iframeUrl !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The iframeUrl option must be a string.`)
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
    if (typeof options.backgroundColor !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The backgroundColor option must be a string.`)
      return false
    }
    if (typeof options.accentColor !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The accentColor option must be a string.`)
      return false
    }
    if (typeof options.errorColor !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The errorColor option must be a string.`)
      return false
    }
    if (typeof options.inputBackgroundColor !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The inputBackgroundColor option must be a string.`)
      return false
    }
    if (typeof options.inputBorderColor !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The inputBorderColor option must be a string.`)
      return false
    }
    if (typeof options.inputBorderRadius !== 'number' && options.inputBorderRadius !== undefined) {
      console.error(`${CheckoutInstance.LOGTAG} The inputBorderRadius option must be a number.`)
      return false
    }
    if (typeof options.inputFloatingLabel !== 'boolean') {
      console.error(`${CheckoutInstance.LOGTAG} The inputFloatingLabel option must be a boolean.`)
      return false
    }
    if (typeof options.inputFloatingLabel !== 'boolean') {
      console.error(`${CheckoutInstance.LOGTAG} The inputFloatingLabel option must be a boolean.`)
      return false
    }
    if (typeof options.buttonBackgroundColor !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The buttonBackgroundColor option must be a string.`)
      return false
    }
    if (
      typeof options.buttonBorderRadius !== 'number' &&
      options.buttonBorderRadius !== undefined
    ) {
      console.error(`${CheckoutInstance.LOGTAG} The buttonBorderRadius option must be a number.`)
      return false
    }
    if (typeof options.buttonBoxShadow !== 'boolean') {
      console.error(`${CheckoutInstance.LOGTAG} The buttonBoxShadow option must be a boolean.`)
      return false
    }
    if (typeof options.fontFamily !== 'string') {
      console.error(`${CheckoutInstance.LOGTAG} The fontFamily option must be a string.`)
      return false
    }
    if (typeof options.baseFontSize !== 'number' && options.baseFontSize !== undefined) {
      console.error(`${CheckoutInstance.LOGTAG} The baseFontSize option must be a number.`)
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
   * If the Checkout gets an error or if it is closed without a successful payment, the event listener is not removed.
   */
  private handleMessage(e: MessageEvent) {
    const originTrailingSlash = e.origin.endsWith('/') ? e.origin : e.origin.concat('/')
    const iframeUrlTrailingSlash = this.originUrl.endsWith('/')
      ? this.originUrl
      : this.originUrl.concat('/')

    if (originTrailingSlash === iframeUrlTrailingSlash && e.data.type === 'ep-checkout') {
      if (e.data.status === 'close') {
        if (this.dialog) {
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          this.dialog.close()
        }
        if (this.options.onClose) {
          this.options.onClose()
        }
        if (this.successfulPaymentInteraction && this.messageHandler) {
          window.removeEventListener('message', this.messageHandler)
        }
      }

      switch (e.data.status) {
        case 'success':
          this.successfulPaymentInteraction = true
          this.options.onSuccess!(e.data.checkout)
          break
        case 'error':
          this.options.onError!(e.data.error)
          break
        case 'payment-error':
          const paymentError: CheckoutPaymentError = {
            code: e.data.error.code,
            paymentMethod: e.data.paymentMethod,
          }
          if (e.data.checkout) {
            paymentError.checkout = e.data.checkout
          }
          this.options.onPaymentError!(paymentError)
          break
        default:
        // Do nothing
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
    if (this.options.backgroundColor) {
      dialog.setAttribute('style', `background-color:${this.options.backgroundColor}`)
    }

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
