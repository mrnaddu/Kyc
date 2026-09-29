class QRScannerComponent {
  constructor() {
    this.scanner = null;
    this.scanned = false;
  }

  initScanner() {
    this.scanner = new Html5QrcodeScanner("scanner-container", {
      fps: 10,
      qrbox: {
        width: 300,
        height: 300
      }
    });
    this.scanner.render();
    this.scanner.start();
  }

  onScanSuccess(decodedText) {
    this.scanned = true;
    return decodedText;
  }

  stopScanner() {
    if (this.scanner) {
      this.scanner.clear();
      this.scanner.destroy();
    }
  }
}

module.exports = QRScannerComponent;