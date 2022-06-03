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
    openBtn?: string
    closeBtn?: string
    primaryButtons?: string
    secondaryButtons?: string
    logoImg?: string
    stepBadgePrimary?: string
    stepBadgeSecondary?: string
    stepTextPrimary?: string
    stepTextSecondary?: string
    cartBtn?: string
    cart?: string
    cartItem?: string
    hideDetails?: boolean
  }
}

/** Represents an error that happened during a Checkout session. */
export interface CheckoutError {
  /** The error code. One of 'checkout-expired', 'already-paid', or 'generic-error'. */
  code: string
}

/**
 * The possible options to configure the Checkout SDK.
 */
export interface CheckoutOptions {
  /** The id of the HTML element in which to insert the Checkout form. */
  id?: string
  /** The callback to call on Checkout successful completion. */
  onSuccess?: (message: string) => void
  /** The callback to call on Checkout errors. */
  onError?: (error: CheckoutError) => void
  /** Whether the SDK should use testing APIs. */
  testing?: boolean
}

/**
 * The default values for all the options.
 */
const defaultOptions: CheckoutOptions = {
  id: 'easypay-checkout',
  onSuccess: () => { /* do nothing */ },
  onError: () => { /* do nothing */ },
  testing: false,
}

/**
 * Encapsulates a Checkout instance created by startCheckout.
 * Stores useful parameters and allows cleanup when unmount() is called.
 */
export class CheckoutInstance {
  private static PROD_URL = 'https://checkout-serverless.quality-utility.aws.easypay.pt'
  private static TEST_URL = 'https://checkout-serverless.sandbox.easypay.pt'
  private static LOGTAG = '[easypay Checkout SDK]'

  private options: CheckoutOptions
  private originUrl = CheckoutInstance.PROD_URL
  private messageHandler: ((e: MessageEvent) => void) | null = null

  /**
   * The class constructor. Sets up the iframe contents and event listener.
   */
  constructor(private manifest: CheckoutManifest, private givenOptions: CheckoutOptions) {
    this.options = {...defaultOptions, ...givenOptions}
    if (!this.validateParameters(manifest, this.options)) {
      return
    }
    if (this.options.testing) {
      this.originUrl = CheckoutInstance.TEST_URL
    }
    this.messageHandler = this.handleMessage.bind(this)
    window.addEventListener('message', this.messageHandler)
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', `${this.originUrl}?manifest=${this.encodeManifest(manifest)}`)
    // Using the attributes below in order to provide defaults without overriding CSS styles.
    iframe.setAttribute('width', '400')
    iframe.setAttribute('height', '700')
    iframe.setAttribute('frameborder', '0')
    document.getElementById(this.options.id!)?.appendChild(iframe)
  }

  /**
   * Validates the necessary parameters for Checkout initialization and gives helpful messages for integrators.
   */
  private validateParameters(manifest: CheckoutManifest, options: CheckoutOptions) {
    if (!manifest || typeof manifest.id !== 'string' || manifest.id === '' || typeof manifest.session !== 'string' || manifest.session === '') {
      console.error(`${CheckoutInstance.LOGTAG} Please provide a valid Checkout Manifest when calling startCheckout.`)
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
    if (typeof options.testing !== 'boolean') {
      console.error(`${CheckoutInstance.LOGTAG} The testing option must be true or false.`)
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
   * If the Checkout becomes completed, automatically removes the event listener.
   */
  private handleMessage(e: MessageEvent) {
    if (e.origin === this.originUrl && e.data.type === 'ep-checkout') {
      if (e.data.status === 'success') {
        this.options.onSuccess!(e.data.status)
        if (this.messageHandler) {
          window.removeEventListener('message', this.messageHandler)
        }
      } else if (e.data.status === 'error') {
        this.options.onError!(e.data.error)
      }
    }
  }

  /**
   * Used to cleanup Checkout by removing the DOM contents and event listener.
   */
  unmount() {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler)
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
