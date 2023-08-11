/* eslint-disable @typescript-eslint/ban-ts-comment */
import { startCheckout, CheckoutOutput } from './index'
import { version as sdkVersion } from '../package.json'

describe('SDK', () => {
  const manifest = {
    id: 'id',
    session: 'session',
    config: null,
  }

  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
    /* do nothing */
  })

  const checkoutResult: CheckoutOutput = {
    id: '2fdc12ca-d600-4ef4-be51-be1626cc1328',
    type: 'single',
    payment: {
      id: '4e5a2766-e010-4ed0-8bc0-eea57fb30d63',
      method: 'cc',
      status: 'authorised',
      value: 120,
    },
  }

  afterEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ''
  })

  test('displays error when it receives no manifest', () => {
    // @ts-ignore
    startCheckout()
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('provide a valid Checkout Manifest')
    )
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a manifest with missing session', () => {
    // @ts-ignore
    startCheckout({ id: 'id' })
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('provide a valid Checkout Manifest')
    )
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a manifest with missing id', () => {
    // @ts-ignore
    startCheckout({ session: 'session' })
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('provide a valid Checkout Manifest')
    )
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a manifest with empty session', () => {
    // @ts-ignore
    startCheckout({ id: 'id', session: '' })
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('provide a valid Checkout Manifest')
    )
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a manifest with empty id', () => {
    // @ts-ignore
    startCheckout({ id: '', session: 'session' })
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('provide a valid Checkout Manifest')
    )
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string element id', () => {
    // @ts-ignore
    startCheckout(manifest, { id: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('HTML element id'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives an empty element id', () => {
    startCheckout(manifest, { id: '' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('HTML element id'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it cannot find the host element', () => {
    startCheckout(manifest)
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Could not find element'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-function success handler', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { onSuccess: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('onSuccess callback'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-function error handler', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { onError: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('onError callback'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-function paymentError handler', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { onPaymentError: false })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('onPaymentError callback'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-function close handler', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { onClose: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('onClose callback'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-boolean testing option', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { testing: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('testing option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string iframeUrl', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { iframeUrl: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('iframeUrl option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string display option', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { display: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('display option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives an empty display option', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { display: '' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('display option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('display error when it receives a non-boolean hideDetails option', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { hideDetails: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('hideDetails option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('display error when it receives a non-string language option', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { language: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('language option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('display error when it receives a non-string logoUrl option', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { logoUrl: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('logoUrl option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string element backgroundColor', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { backgroundColor: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('backgroundColor option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string element accentColor', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { accentColor: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('accentColor option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string element errorColor', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { errorColor: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('errorColor option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string element inputBackgroundColor', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { inputBackgroundColor: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('inputBackgroundColor option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string element inputBorderColor', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { inputBorderColor: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('inputBorderColor option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-number element inputBorderRadius', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { inputBorderRadius: 'test' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('inputBorderRadius option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-boolean element inputFloatingLabel', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { inputFloatingLabel: 'test' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('inputFloatingLabel option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string element buttonBackgroundColor', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { buttonBackgroundColor: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('buttonBackgroundColor option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-number element buttonBorderRadius', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { buttonBorderRadius: 'test' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('buttonBorderRadius option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-boolean element buttonBoxShadow', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { buttonBoxShadow: 'test' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('buttonBoxShadow option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-string element fontFamily', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { fontFamily: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('fontFamily option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a non-number element baseFontSize', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { baseFontSize: 'test' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('baseFontSize option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays default backgroundColor when not set', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    const checkout = startCheckout(manifest)
    const iframe = document.querySelector('#easypay-checkout iframe') as HTMLIFrameElement
    expect(iframe.getAttribute('style')).toContain('background-color:white')
    checkout.unmount()
  })

  test('displays customize backgroundColor', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    const checkout = startCheckout(manifest, { display: 'popup', backgroundColor: '#32a852' })

    const dialog = document.querySelector('.epcsdk-modal') as HTMLElement
    const iframe = document.querySelector('.epcsdk-modal iframe') as HTMLIFrameElement
    expect(iframe).toBeTruthy()
    expect(dialog).toBeTruthy()
    expect(dialog.getAttribute('style')).toContain('background-color:#32a852')
    expect(iframe.getAttribute('style')).toContain('background-color:#32a852')

    const iframeContent = iframe.contentDocument
    if (iframeContent?.readyState == 'complete') {
      const checkoutCanvas = iframeContent.querySelector('.ep-checkout-canvas') as HTMLDivElement
      const canvasStyles = window.getComputedStyle(checkoutCanvas)
      expect(canvasStyles.backgroundColor).toBe('#32a852')
    }

    checkout.unmount()
  })

  test('accepts correct arguments and requests checkout', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    const checkout = startCheckout(manifest)
    expect(consoleSpy).not.toHaveBeenCalled()
    const iframe = document.querySelector('#easypay-checkout iframe') as HTMLIFrameElement
    const manifestString = window.btoa(JSON.stringify({
      id: 'id',
      session: 'session',
      config: {
        allowClose: false,
        backgroundColor: 'white',
        inputFloatingLabel: true,
        buttonBoxShadow: true,
        sdkVersion,
      }
    }))
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute('src')).toBe(
      `https://pay.easypay.pt?manifest=${manifestString}`
    )
    checkout.unmount()
  })

  test('requests testing URL', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    const checkout = startCheckout(manifest, { testing: true })
    expect(consoleSpy).not.toHaveBeenCalled()
    const iframe = document.querySelector('#easypay-checkout iframe') as HTMLIFrameElement
    const manifestString = window.btoa(JSON.stringify({
      id: 'id',
      session: 'session',
      config: {
        allowClose: false,
        backgroundColor: 'white',
        inputFloatingLabel: true,
        buttonBoxShadow: true,
        sdkVersion,
      }
    }))
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute('src')).toBe(
      `https://pay.sandbox.easypay.pt?manifest=${manifestString}`
    )
    checkout.unmount()
  })

  test('requests custom URL', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    const checkout = startCheckout(manifest, { iframeUrl: 'https://localhost/nothing' })
    expect(consoleSpy).not.toHaveBeenCalled()
    const iframe = document.querySelector('#easypay-checkout iframe') as HTMLIFrameElement
    const manifestString = window.btoa(JSON.stringify({
      id: 'id',
      session: 'session',
      config: {
        allowClose: false,
        backgroundColor: 'white',
        inputFloatingLabel: true,
        buttonBoxShadow: true,
        sdkVersion,
      }
    }))
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute('src')).toBe(
      `https://localhost/nothing?manifest=${manifestString}`
    )
    checkout.unmount()
  })

  test('reacts to success postMessages', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedSuccess
    const checkout = startCheckout(manifest, {
      onSuccess: (checkoutMessage) => {
        storedSuccess = checkoutMessage
      },
    })

    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'success', checkout: checkoutResult },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(message)
    expect(storedSuccess).toEqual(checkoutResult)
    checkout.unmount()
  })

  test('reacts to error postMessages', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedError = {}
    const checkout = startCheckout(manifest, {
      onError: (error) => {
        storedError = error
      },
    })
    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'error', error: { code: 'checkout-expired' } },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(message)
    expect(storedError).toEqual({ code: 'checkout-expired' })
    checkout.unmount()
  })

  test('reacts to payment-error postMessages without checkout object', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedPaymentError = {}
    const checkout = startCheckout(manifest, {
      onPaymentError: (error) => {
        storedPaymentError = error
      },
    })
    const message: MessageEvent = new MessageEvent('message', {
      data: {
        type: 'ep-checkout',
        status: 'payment-error',
        error: { code: 'generic-error' },
        paymentMethod: 'mb',
      },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(message)
    expect(storedPaymentError).toEqual({ code: 'generic-error', paymentMethod: 'mb' })
    checkout.unmount()
  })

  test('reacts to payment-error postMessages with checkout object', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedPaymentError = {}
    const checkout = startCheckout(manifest, {
      onPaymentError: (error) => {
        storedPaymentError = error
      },
    })
    const message: MessageEvent = new MessageEvent('message', {
      data: {
        type: 'ep-checkout',
        status: 'payment-error',
        error: { code: 'payment-failure' },
        paymentMethod: 'cc',
        checkout: checkoutResult,
      },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(message)
    expect(storedPaymentError).toEqual({
      code: 'payment-failure',
      paymentMethod: 'cc',
      checkout: checkoutResult,
    })
    checkout.unmount()
  })

  test('calls onClose in inline mode', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedCall = false
    const checkout = startCheckout(manifest, {
      onClose: () => {
        storedCall = true
      },
    })
    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'close' },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(message)
    expect(storedCall).toBe(true)
    checkout.unmount()
  })

  test('calls onClose in popup mode', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedCall = false
    const checkout = startCheckout(manifest, {
      display: 'popup',
      onClose: () => {
        storedCall = true
      },
    })
    document.getElementById('easypay-checkout')?.click()
    expect(document.querySelector('dialog')?.attributes.getNamedItem('open')?.value).toBe('')
    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'close' },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(message)
    expect(storedCall).toBe(true)
    expect(document.querySelector('dialog')?.attributes.getNamedItem('open')).toBe(null)
    checkout.unmount()
  })

  test('cleans up the DOM', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    const checkout = startCheckout(manifest)
    expect(document.querySelector('#easypay-checkout iframe')).toBeTruthy()
    checkout.unmount()
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('cleans up the message handler on completion', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedSuccess
    const checkout = startCheckout(manifest, {
      onSuccess: (checkoutMessage) => {
        storedSuccess = checkoutMessage
      },
    })
    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'success', checkout: checkoutResult },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(message)
    expect(storedSuccess).toEqual(checkoutResult)
    const closeMessage: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'close' },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(closeMessage)
    const secondMessage: MessageEvent = new MessageEvent('message', {
      data: {
        type: 'ep-checkout',
        status: 'success',
        checkout: {
          id: '2fdc12ca-d600-4ef4-be51-be1626cc1329',
          type: 'single',
          payment: {
            id: '4e5a2766-e010-4ed0-8bc0-eea57fb30d63',
            method: 'cc',
            status: 'authorised',
            value: 120,
          },
        },
      },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(secondMessage)
    expect(storedSuccess).toEqual(checkoutResult)
    checkout.unmount()
  })

  test('cleans up the message handler on unmount', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedSuccess
    const checkout = startCheckout(manifest, {
      onSuccess: (checkoutMessage) => {
        storedSuccess = checkoutMessage
      },
    })
    checkout.unmount()
    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'success', checkout: checkoutResult },
      origin: 'https://pay.easypay.pt',
    })
    window.dispatchEvent(message)
    expect(storedSuccess).toBeUndefined()
  })

  test('ignores messages from unrecognized URLs', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedSuccess
    const checkout = startCheckout(manifest, {
      onSuccess: (checkoutMessage) => {
        storedSuccess = checkoutMessage
      },
    })
    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'success' },
      origin: 'https://unrecognized.easypay.pt',
    })
    window.dispatchEvent(message)
    expect(storedSuccess).toBeUndefined()
    checkout.unmount()
  })

  test('iframe accepts style configurations parameters', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    const options = {
      hideDetails: true,
      backgroundColor: 'lightgreen',
      accentColor: 'darkblue',
      errorColor: 'mediumpurple',
      inputBackgroundColor: 'lightgreen',
      inputBorderColor: 'darkblue',
      inputBorderRadius: 2,
      inputFloatingLabel: false,
      buttonBorderRadius: 3,
      buttonBoxShadow: false,
      fontFamily: 'Courier New',
      baseFontSize: 20,
    }
    const checkout = startCheckout(manifest, options)
    expect(consoleSpy).not.toHaveBeenCalled()
    const iframe = document.querySelector('#easypay-checkout iframe') as HTMLIFrameElement
    const manifestString = window.btoa(JSON.stringify({
      id: 'id',
      session: 'session',
      config: {
        allowClose: false,
        backgroundColor: 'lightgreen',
        inputFloatingLabel: false,
        buttonBoxShadow: false,
        sdkVersion,
        hideDetails: true,
        accentColor: 'darkblue',
        errorColor: 'mediumpurple',
        inputBackgroundColor: 'lightgreen',
        inputBorderColor: 'darkblue',
        inputBorderRadius: 2,
        buttonBorderRadius: 3,
        fontFamily: 'Courier New',
        baseFontSize: 20
      }
    }))
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute('src')).toBe(
      `https://pay.easypay.pt?manifest=${manifestString}`
    )
    checkout.unmount()
  })
})
