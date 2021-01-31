const { totp } = require('otplib');
totp.options = { step: 120 };

module.exports.generateOtp = () => {
    try {
        const otp = totp.generate(process.env.OTP_SECRET);
        return otp
    } catch (error) {
        return 'There was an error generating the OTP.';
    }
}

module.exports.validateOtp = otp => {
    try {
        return totp.check(otp, process.env.OTP_SECRET)
    } catch (error) {
        throw error;
    }
}