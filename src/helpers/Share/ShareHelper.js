/**
 * ShareHelper.
 * @class ShareHelper
 */
class ShareHelper {
  /**
   * email.
   * @method email
   * @param {string} title ctaLabel
   * @param {string} id id of card
   * @param {string} frontendBaseUrl Frontend base url for creating links
   * @returns {undefined}
   */
  email(title, id, frontendBaseUrl) {
    const sharingEmailMessage = {
      subject: 'Een bewoner vond dit interessant voor jou op Tippiq Buurt!',
      body: `\
Beste,
${this.encodedBreak()}${this.encodedBreak()}
Via Tippiq Buurt ontdekte ik ${title || 'dit'} en ik bedacht me dat jij dit weleens interessant zou kunnen vinden.
${this.encodedBreak()}${this.encodedBreak()}
Zie hier meer informatie over dit bericht: ${frontendBaseUrl}/card/${id}.
${this.encodedBreak()}${this.encodedBreak()}
Als je meer wilt weten wat er rond jouw huis gebeurt, gevraagd of aangeboden wordt, check 't met buurt.tippiq.nl!${this.encodedSpace()}
Hier vind je diverse aanbieders met nuttige, handige en/of urgente informatie.
${this.encodedBreak()}${this.encodedBreak()}
Met vriendelijke groet,
${this.encodedBreak()}${this.encodedBreak()}
Team Tippiq Buurt`,
    };
    window.location.href = `mailto:?subject=${sharingEmailMessage.subject}&body=${sharingEmailMessage.body}`;
  }

  /**
   * Encodes a break character for layout of mailto body.
   * @return {string} Encoded break (<br/>) character
   */
  encodedBreak() {
    return '%0D%0A';
  }

  /**
   * Encodes a space character for layout of mailto body.
   * @return {string} Encoded whitespace character
   */
  encodedSpace() {
    return '%20';
  }

  /**
   * Render email
   * @method email
   * @param {string} id id of card
   * @param {string} frontendBaseUrl Frontend base url for creating links
   * @returns {undefined}
   */
  whatsapp(id, frontendBaseUrl) {
    const message = `Check dit bericht van Tippiq Buurt: ${frontendBaseUrl}/card/${id}`;
    window.location.href = `whatsapp://send?text=${encodeURIComponent(message)}`;
  }

  /**
   * social
   * @method social
   * @param {Object} platform title id
   * @param {string} frontendBaseUrl Frontend base url for creating links
   * @returns {undefined}
   */
  social({ platform, ctaLabel, id, title }, frontendBaseUrl) { // eslint-disable-line complexity
    if (platform === 'facebook' || platform === 'twitter') {
      const winWidth = window.innerWidth / 2;
      const winHeight = window.innerHeight / 2;
      const winTop = (screen.height / 2) - (winHeight / 2);
      const winLeft = (screen.width / 2) - (winWidth / 2);
      const windowOptions = `status=1, width=${winWidth}, height=${winHeight}, top=${winTop}, left=${winLeft}, toolbar=0, status=0`;

      /* eslint-disable */
      switch (platform) {
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${frontendBaseUrl}/card/${id}`;
          window.open(facebookUrl, 'sharer', windowOptions);
          break;
        case 'twitter':
          const twitterMessage = `Check dit bericht van @Tippiq: ${frontendBaseUrl}/card/${id}`;
          const twitterUrl = `https://twitter.com/home?status=${twitterMessage}`;
          window.open(twitterUrl, 'twitter', windowOptions);
          break;
        default:
          return;
      }
      /* eslint-enable */
    } else {
      switch (platform) {
        case 'mail':
        case 'email':
          this.email(ctaLabel || title, id, frontendBaseUrl);
          break;
        case 'whatsapp':
          this.whatsapp(id, frontendBaseUrl);
          break;
        default:
          return;
      }
    }
  }
}

export default ShareHelper;
