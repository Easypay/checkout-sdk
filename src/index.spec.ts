/* eslint-disable @typescript-eslint/ban-ts-comment */
import { startCheckout, CheckoutOutput } from './index'

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

  test('display error when it receives and non-boolean hideDetails option', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { hideDetails: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('hideDetails option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('display error when it receives and non-string language option', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { language: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('language option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('display error when it receives and non-string logoUrl option', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { logoUrl: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('logoUrl option'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives an onClose option without display option set to popup', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, {
      onClose: () => {
        return 'close'
      },
      display: 'inline',
    })
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('onClose callback can only be used with display popup')
    )
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('accepts correct arguments and requests checkout', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    const checkout = startCheckout(manifest)
    expect(consoleSpy).not.toHaveBeenCalled()
    const iframe = document.querySelector('#easypay-checkout iframe') as HTMLIFrameElement
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute('src')).toBe(
      'https://pay.easypay.pt?manifest=eyJpZCI6ImlkIiwic2Vzc2lvbiI6InNlc3Npb24iLCJjb25maWciOnsiYWxsb3dDbG9zZSI6ZmFsc2UsInNka1ZlcnNpb24iOiIyLjAuMCJ9fQ=='
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
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute('src')).toBe(
      'https://pay.sandbox.easypay.pt?manifest=eyJpZCI6ImlkIiwic2Vzc2lvbiI6InNlc3Npb24iLCJjb25maWciOnsiYWxsb3dDbG9zZSI6ZmFsc2UsInNka1ZlcnNpb24iOiIyLjAuMCJ9fQ=='
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
    const secondMessage: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'success', checkout: checkoutResult },
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
})
