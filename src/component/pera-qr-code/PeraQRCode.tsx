/* eslint-disable no-magic-numbers */
import PeraQRLogo from "../../core/ui/image/pera-qr-logo.png";

import {QRCode} from "react-qrcode-logo";

function PeraQRCode({value}: {value: string}) {
  return (
    <QRCode
      size={212}
      logoImage={PeraQRLogo}
      logoWidth={72}
      logoHeight={72}
      quietZone={24}
      qrStyle={"dots"}
      eyeRadius={[
        {
          outer: [5, 10, 0, 10],
          inner: 0
        },
        {
          outer: [10, 5, 10, 0],
          inner: 0
        },
        {
          outer: [10, 0, 10, 5],
          inner: 0
        }
      ]}
      value={value}
    />
  );
}

export default PeraQRCode;
/* eslint-enable no-magic-numbers */
