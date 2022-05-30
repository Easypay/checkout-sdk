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

/**
 * The possible options to configure the Checkout SDK.
 */
export interface CheckoutOptions {
  /** The id of the HTML element in which to insert the Checkout form. */
  id?: string
  /** The callback to call on Checkout events. */
  onMessage?: (message: string) => void
  /** Whether the SDK should use testing APIs. */
  testing?: boolean
}

/**
 * The default values for all the options.
 */
const defaultOptions: CheckoutOptions = {
  id: 'easypay-checkout',
  onMessage: () => { /* do nothing */ },
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
    // Using the attributes below in order to provide defaults without overriding CSS styles
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
    if (typeof options.onMessage !== 'function') {
      console.error(`${CheckoutInstance.LOGTAG} The onMessage callback must be a function.`)
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
   * pass them on to the message handler that was configured in startCheckout.
   *
   * If the Checkout becomes completed, automatically removes the event listener.
   */
  private handleMessage(e: MessageEvent) {
    if (e.origin === this.originUrl && e.data.type === 'ep-checkout') {
      this.options.onMessage!(e.data.status)
      if (e.data.status === 'complete') {
        if (this.messageHandler) {
          window.removeEventListener('message', this.messageHandler)
        }
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
