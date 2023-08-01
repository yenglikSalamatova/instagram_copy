const nodemailer = require("nodemailer");

async function sendVerificationCode(email, code) {
  try {
    // Настройки для отправки электронных писем через SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_SEND_EMAIL,
        pass: process.env.GOOGLE_SEND_PASS,
      },
    });

    // Опции письма
    const mailOptions = {
      from: process.env.GOOGLE_SEND_EMAIL,
      to: email,
      subject: "Verification Code",
      html: `
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>

    <style type="text/css">
      @media only screen and (min-width: 520px) {
  .u-row {
    width: 500px !important;
  }
  .u-row .u-col {
    vertical-align: top;
  }

  .u-row .u-col-100 {
    width: 500px !important;
  }

}

@media (max-width: 520px) {
  .u-row-container {
    max-width: 100% !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .u-row .u-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .u-row {
    width: 100% !important;
  }
  .u-col {
    width: 100% !important;
  }
  .u-col > div {
    margin: 0 auto;
  }
}
body {
  margin: 0;
  padding: 0;
}

table,
tr,
td {
  vertical-align: top;
  border-collapse: collapse;
}

p {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: inherit !important;
  text-decoration: none !important;
}

table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
    </style>



</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->



<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

<!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ffffff;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
  <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">

      <img align="center" border="0" src="https://ci4.googleusercontent.com/proxy/vHv3tRtE3I_2w6zR6JFt066OaSywcGpzkuO02W6QMIeOfCWNMc-TyEJKxu4mG2hoBsYBLNnCt6VSzhJNl2kOXcZTRdglv3R20xUvvc29ow=s0-d-e1-ft#https://static.xx.fbcdn.net/rsrc.php/v3/yO/r/Otjcwa2eCOF.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 30%;max-width: 144px;" width="144"/>

    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
    <p style="color: #565a5c; white-space: normal; background-color: #ffffff; margin: 10px 0px; line-height: 140%;">Hi,</p>
<p style="color: #565a5c; white-space: normal; background-color: #ffffff; margin: 10px 0px; line-height: 140%;">Someone tried to sign up for an Instagram account with <a rel="noopener" href="mailto:${email}" target="_blank" style="color: #1155cc;">${email}</a>. If it was you, enter this confirmation code in the app:</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 33px; font-weight: 400;"><span style="color: #565a5c; text-align: center; white-space: normal; background-color: #ffffff; float: none; display: inline;">${code}</span></h1>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">

      <img align="center" border="0" src="https://ci4.googleusercontent.com/proxy/EJZbh4o__ilxW-Qeu9CLvNAN7DS93sdYd0ZWHbRbsuZTMeA01I_dPjJ8ksrB2zX5CDoDyOrShH2RhVZy5cghftAAEMZI0T10gEk20cA2OA=s0-d-e1-ft#https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/Bqo9-L659wB.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 11%;max-width: 52.8px;" width="52.8"/>

    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:11px;font-family:arial,helvetica,sans-serif;" align="left">

  <div style="font-size: 12px; line-height: 140%; text-align: left; word-wrap: break-word;">
    <div style="text-align: center; white-space: normal; background-color: #ffffff; color: #abadae; margin: 0px auto 5px;">© Instagram. Meta Platforms, Inc., 1601 Willow Road, Menlo Park, CA 94025</div>
<div style="text-align: center; white-space: normal; background-color: #ffffff; color: #abadae; margin: 0px auto 5px;">This message was sent to <span style="text-decoration: underline; line-height: 19.6px;">${email}.</span></div>
  </div>

      </td>
    </tr>
  </tbody>
</table>
</body>

</html>

    `,
    };

    // Отправка письма
    await transporter.sendMail(mailOptions);
    console.log("Verification code email sent successfully.");
    return true; // Успешно отправлено
  } catch (error) {
    console.error("Error sending verification code email:", error);
    return false; // Ошибка при отправке
  }
}

module.exports = sendVerificationCode;
