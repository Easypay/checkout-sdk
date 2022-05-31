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

| Option      | Type       | Required | Default            | Description                                                                                  |
| ----------- | ---------- | -------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `id`        | `string`   | no       | `easypay-checkout` | parameter to link the element in the page                                                    |
| `onMessage` | `function` | no       | `() => {}`         | callback function to receive the checkout event. (for now, only `'complete'` is available)   |
| `testing`   | `boolean`  | no       | `false`            | parameter to specify whether to use the testing API (`true`) or the production one (`false`) |

### Linking to the Page

```html
<div id="easypay-checkout"></div>
```

### Remove checkout from Page

```js
checkoutInstance.unmount()
```

### On Completion

```js
const checkoutInstance = startCheckout(manifest, {
  onMessage: myMessageHandler,
})

function myMessageHandler(checkoutMessage) {
  if (checkoutMessage === 'complete') {
    checkoutInstance.unmount()
    document.write('Checkout session complete. Thank you.')
  }
}
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
