# Easypay Checkout SDK

Easypay's Checkout SDK is intended to facilitate integration between your application and our solution to receive payments.

![easypay-checkout](https://user-images.githubusercontent.com/30448483/175095028-a36de17a-6531-4573-86fc-459b8586376c.gif)

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

| Option           | Type       | Required | Default              | Description                                                                |
| ---------------- | ---------- | -------- | -------------------- | -------------------------------------------------------------------------- |
| `id`             | `string`   | no       | `'easypay-checkout'` | The id of the HTML element where the Checkout form should be included.     |
| `onSuccess`      | `function` | no       | `() => {}`           | Callback function to be called when the Checkout is finished successfully. |
| `onError`        | `function` | no       | `() => {}`           | Callback function to be called on (unrecoverable) errors.                  |
| `onPaymentError` | `function` | no       | `() => {}`           | Callback function to be called on (recoverable) payment errors.            |
| `onClose`        | `function` | no       | `undefined`          | Callback function to be called when the Checkout interaction is closed.    |
| `testing`        | `boolean`  | no       | `false`              | Whether to use the testing API (`true`) or the production one (`false`).   |
| `display`(1)     | `string`   | no       | `'inline'`           | The display style of the element that hosts the Checkout.                  |
| `hideDetails`    | `boolean`  | no       | `false` | Whether to hide the details form or not. An expandable summary will be shown with the details, instead. |
| `language`(2)    | `string`   | no       | `undefined`          | The language in which to display the Checkout.                             |
| `logoUrl`               | `string`  | no       | `undefined`     | The merchant logo url to display in the Checkout.                           |
| `backgroundColor`       | `string`  | no       | `'#ffffff'`     | The color used as the background of the Checkout page.                      |
| `accentColor`           | `string`  | no       | `'#0d71f9'`     | The color used in highlights, as well as default buttons and input borders. |
| `errorColor`            | `string`  | no       | `'#ff151f'`     | The color used for errors.                                                  |
| `inputBackgroundColor`  | `string`  | no       | `'transparent'` | The color used for the input backgrounds.                                   |
| `inputBorderColor`      | `string`  | no       | *accentColor*   | The color for input borders.                                                |
| `inputBorderRadius`     | `number`  | no       | `50`            | The border radius for inputs, in `px`.                                      |
| `inputFloatingLabel`    | `boolean` | no       | `true`          | Whether inputs should use floating labels.                                  |
| `buttonBackgroundColor` | `string`  | no       | *accentColor*   | The color used for the button backgrounds.                                  |
| `buttonBorderRadius`    | `number`  | no       | `50`            | The border radius for buttons, in `px`.                                     |
| `buttonBoxShadow`       | `boolean` | no       | `true`          | Whether the buttons should have box-shadow.                                 |
| `fontFamily`            | `string`  | no       | `'Overpass'`    | The font used for the text.                                                 |
| `baseFontSize`          | `number`  | no       | `10`            | The value in `px` for the font size of the root element (`1rem`).           |

#### Options

(1)`display` available values: `inline`(default) or `popup`
(2)`language` available values: `en` or `pt_PT`

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
function mySuccessHandler(successInfo) {
  /** Show your own thank you message and/or do something with the payment info. */
}

const checkoutInstance = startCheckout(manifest, {
  onSuccess: mySuccessHandler,
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
    case 'checkout-canceled':
      /** Order was canceled */
      break
    default:
      /** Unable to process payment. */
  }
}

const checkoutInstance = startCheckout(manifest, {
  onError: myErrorHandler
})
```

### On Close

```js
function myCloseHandler() {
  /** Checkout interaction closed */
}

const checkoutInstance = startCheckout(manifest, {
  onClose: myCloseHandler,
})
```

### Changing appearance

```js
const checkoutInstance = easypayCheckout.startCheckout(manifest, {
  logoUrl: 'www.example.com/mylogo.png',
  accentColor: 'orange',
  buttonBackgroundColor: '#111',
  buttonBoxShadow: false,
  buttonBorderRadius: 5,
  inputBorderRadius: 5,
  inputBorderColor: '#000',
  inputBackgroundColor: '#ffe7c4',
  backgroundColor: '#eee',
  fontFamily: 'https://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCIPrEVIT9d0c8.woff2',
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

A [live version](https://checkout-demo.easypay.pt/) of an integration with the SDK is available.

To test the package locally, you can use the source code for the [checkout-demo](https://github.com/Easypay/checkout-demo) as a starting point.

## Common Problems

There are a few problems that may come up while integrating Checkout with your app.

- **Checkout not showing/Blank page initiating checkout**

  If this occurs while integrating Checkout, check the browser devtools to see more details about the error.
  Sometimes due to some misconfiguration, while calling Checkout creation, this may happen. The fix is simple:
    1. Open the browser devtools to check which config option is throwing the error.
    2. Update the option accordingly.