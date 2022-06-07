# Easypay Checkout SDK

Easypay's Checkout SDK is intended to facilitate integration between your application and our solution to receive payments.

![easypay-checkout](https://user-images.githubusercontent.com/30448483/171024493-dbda5a46-45d9-4810-ba89-a276d88c770b.gif)

## Installation:

Install the package with:

```sh
npm install --save @easypaypt/checkout-sdk

# or

yarn add @easypaypt/checkout-sdk
```

## Usage:

### Import

```js
import { startCheckout } from '@easypaypt/checkout-sdk'

const checkoutInstance = startCheckout(manifest, [options])
```

**`manifest`** - server to server response from checkout session creation

| Option      | Type       | Required | Default            | Description                                                                   |
| ----------- | ---------- | -------- | ------------------ | ----------------------------------------------------------------------------- |
| `id`        | `string`   | no       | `easypay-checkout` | The id of the HTML element where the Checkout form should be included.        |
| `onSuccess` | `function` | no       | `() => {}`         | Callback function to be called when the Checkout is finished successfully.    |
| `onError`   | `function` | no       | `() => {}`         | Callback function to be called on errors.                                     |
| `testing`   | `boolean`  | no       | `false`            | Whether to use the testing API (`true`) or the production one (`false`).      |

### Linking to the Page

```html
<div id="easypay-checkout"></div>
```

### Remove checkout from Page

```js
checkoutInstance.unmount()
```

### On Success

```javascript
function mySuccessHandler(checkoutPaymentInfo) {
  checkoutInstance.unmount()
  if (checkoutPaymentInfo.paid) {
    /** Payment was received (e.g. credit card). */
  } else {
    /** Payment will be completed later (e.g. Multibanco, bank transfer, etc). */
  }
}

const checkoutInstance = startCheckout(manifest, {
  onSuccess: mySuccessHandler
})
```

### On Error

```javascript
function myErrorHandler(error) {
  checkoutInstance.unmount()
  switch (error.code) {
    case 'checkout-expired':
      /** The Checkout session expired and a new one must be created. */
      const manifest = await yourFunctionToGetTheManifest()
      checkoutInstance = startCheckout(manifest, {
        onError: myErrorHandler
      })
      break
    case 'already-paid':
      /** Order was already paid. */
      break
    default:
      /** Unable to process payment. */
  }
}

const checkoutInstance = startCheckout(manifest, {
  onError: myErrorHandler
})
```

## Development

### Install dependencies:

```bash
$ yarn install

# or

$ npm install
```

### Build package:

```bash
$ yarn build

#or

$ npm run build
```

### Publish package:

```bash
$ npm publish
```

## Demo

To test the package you can use the [checkout-demo](https://github.com/Easypay/checkout-demo)
