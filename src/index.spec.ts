/* eslint-disable @typescript-eslint/ban-ts-comment */
import { startCheckout } from './index'

describe('SDK', () => {
  const manifest = {
    id: 'id',
    session: 'session',
    config: null,
  }
  
  const consoleSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {  /* do nothing */ })
  
  afterEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ''
  })

  test('displays error when it receives no manifest', () => {
    // @ts-ignore
    startCheckout()
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('provide a valid Checkout Manifest'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a manifest with missing session', () => {
    // @ts-ignore
    startCheckout({ id: 'id' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('provide a valid Checkout Manifest'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a manifest with missing id', () => {
    // @ts-ignore
    startCheckout({ session: 'session' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('provide a valid Checkout Manifest'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a manifest with empty session', () => {
    // @ts-ignore
    startCheckout({ id: 'id', session: '' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('provide a valid Checkout Manifest'))
    expect(document.querySelector('#easypay-checkout iframe')).toBeNull()
  })

  test('displays error when it receives a manifest with empty id', () => {
    // @ts-ignore
    startCheckout({ id: '', session: 'session' })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('provide a valid Checkout Manifest'))
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

  test('displays error when it receives a non-function message handler', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    // @ts-ignore
    startCheckout(manifest, { onMessage: 4 })
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('onMessage callback'))
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

  test('accepts correct arguments and requests checkout', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    const checkout = startCheckout(manifest)
    expect(consoleSpy).not.toHaveBeenCalled()
    const iframe = document.querySelector('#easypay-checkout iframe') as HTMLIFrameElement
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute('src')).toBe('https://checkout-serverless.quality-utility.aws.easypay.pt?manifest=eyJpZCI6ImlkIiwic2Vzc2lvbiI6InNlc3Npb24iLCJjb25maWciOm51bGx9')
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
    expect(iframe.getAttribute('src')).toBe('https://checkout-serverless.sandbox.easypay.pt?manifest=eyJpZCI6ImlkIiwic2Vzc2lvbiI6InNlc3Npb24iLCJjb25maWciOm51bGx9')
    checkout.unmount()
  })

  test('reacts to postMessages', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedType = ''
    const checkout = startCheckout(manifest, {
      onMessage: (checkoutMessage) => {
        storedType = checkoutMessage
      }
    })
    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'complete' },
      origin: 'https://checkout-serverless.quality-utility.aws.easypay.pt'
    })
    window.dispatchEvent(message)
    expect(storedType).toBe('complete')
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
    let storedType = ''
    const checkout = startCheckout(manifest, {
      onMessage: (checkoutMessage) => {
        storedType = checkoutMessage
      }
    })
    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'complete' },
      origin: 'https://checkout-serverless.quality-utility.aws.easypay.pt'
    })
    window.dispatchEvent(message)
    expect(storedType).toBe('complete')
    const secondMessage: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'other' },
      origin: 'https://checkout-serverless.quality-utility.aws.easypay.pt'
    })
    window.dispatchEvent(secondMessage)
    expect(storedType).toBe('complete')
    checkout.unmount()
  })

  test('cleans up the message handler on unmount', () => {
    const host = document.createElement('div')
    host.setAttribute('id', 'easypay-checkout')
    document.body.appendChild(host)
    let storedType = ''
    const checkout = startCheckout(manifest, {
      onMessage: (checkoutMessage) => {
        storedType = checkoutMessage
      }
    })
    checkout.unmount()
    const message: MessageEvent = new MessageEvent('message', {
      data: { type: 'ep-checkout', status: 'complete' },
      origin: 'https://checkout-serverless.quality-utility.aws.easypay.pt'
    })
    window.dispatchEvent(message)
    expect(storedType).toBe('')
  })
})
