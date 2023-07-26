# Netron-VSCode-Extension

<div align="center"><image src="https://github.com/a-sidorova/netron-vscode-extension/blob/5b7eb5d4e2f2c07e9a774359e504385229df6315/resources/icon.png?raw=true" height="200" width="200"></div>

`Netron VSCode Extension` is the unofficial extension for Visual Studio Code that allows users to visualize many Deep Learning models using [Netron][netron] server. At the moment the extension supports models of the following frameworks and toolkits: [OpenVINO][openvino], [TensorFlow][tensorflow], [TensorFlow Lite][tensorflow_lite], [ONNX][onnx], [PyTorch][pytorch], [MXNet][mxnet] etc. The extension creates new system subprocess `netron` and visualizes the result of `Netron` in `Webview`.


### How to use

The system must have installed Python package [`netron`][netron_pip].
To install the package run `pip install netron`.

Then right-click on the model file in Explorer and select `Open Netron` from the menu that appears.

<div align="center"><image src="https://github.com/a-sidorova/netron-vscode-extension/blob/5b7eb5d4e2f2c07e9a774359e504385229df6315/resources/demo.gif?raw=true"></div>


### How to build

- Clone and open this repository in Visual Studio Code.
- `npm install`
- Press `F5` to start debugging


### Get a support

Report questions, issues and suggestions, using:

- [GitHub Issues][dli-github-issues]



<!-- LINKS -->
[netron]: https://github.com/lutzroeder/netron
[netron_pip]: https://pypi.org/project/netron
[dli-github-issues]: https://github.com/a-sidorova/netron-vscode-extension/issues
[openvino]: https://docs.openvino.a
[tensorflow]: https://www.tensorflow.org
[tensorflow_lite]: https://www.tensorflow.org/lite
[onnx]: https://onnx.ai
[pytorch]: https://pytorch.org
[mxnet]: https://mxnet.apache.org
