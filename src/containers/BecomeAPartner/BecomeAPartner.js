/**
 * BecomeAPartner container.
 * @module components/BecomeAPartner
 */

import React from 'react';
import { Media, Image } from 'react-bootstrap';
import { StaticPage } from '../../containers';

import styles from './BecomeAPartner.css';

/**
 * BecomeAPartner component.
 * @function BecomeAPartner
 * @returns {string} Markup of the BecomeAPartner page.
 */
const BecomeAPartner = () =>
  <StaticPage title="Partner worden" id="page-become-a-partner">
    <h1>Partner worden</h1>
    <p>
      Met Tippiq Buurt genereer je eenvoudig en snel meer bereik.
      Via het Buurtoverzicht en het Buurtbericht bereiken we
      bewoners met lokale informatie.
    </p>
    <p>
      We hebben ons als doel gesteld buurten sterker te maken door deze
      te verbinden en zo de betrokkenheid en zelfredzaamheid te vergroten.
      Dit doen we door allerhande buurtinformatie op één makkelijk bereikbare
      plek te verzamelen.
      Met Tippiq Buurt helpen we ze een handje.
    </p>
    <p>
      Mogen wij je aan de buurt voorstellen?
    </p>
    <h2>Waarom partner worden?</h2>
    <ul className={styles.checkmarkList}>
      <li>Hyperlokaal bereik</li>
      <li>Kosteloos</li>
      <li>Relevant</li>
    </ul>
    <h2>Wat zeggen onze partners</h2>
    <br />
    <p className={styles.testimonial}>
      &ldquo;Wij zijn erg verheugd dat wij onlangs de samenwerking met Tippiq
      hebben mogen aankondigen. Al meteen ervoeren wij de snelle handelwijze van het
      uitgebalanceerde team en haar natuurlijke drang om constant op zoek te gaan
      naar innovatieve oplossingen.

      Wij kijken uit naar een succesvolle en zeer prettige samenwerking!&rdquo;
    </p>
    <Media>
      <Media.Left className={styles.mediaSmall}>
        <Image circle width={50} height={50} alt="Contactpersoon" />
      </Media.Left>
      <Media.Body>
        <span className={styles.partner}>XXXX</span><br />
        Barqo
      </Media.Body>
    </Media>
    <br />
    <h2>Meer weten?</h2>
    <p>
      Neem dan contact op met XXXX.
      Wil je niet wachten en zo snel mogelijk aansluiten?
      Dan kun je alvast zelf aan de slag met onze API.
    </p>
    <Media>
      <Media.Left className={styles.mediaLarge}>
        <Image circle width={100} height={100} alt="Contactpersoon" />
      </Media.Left>
      <Media.Body>
        <Media.Heading>XXXX</Media.Heading>
        <p>
          T:  06 xx xx xx xx<br />
          M: <a href="mailto:info@tippiq.nl">info@tippiq.nl</a>
        </p>
      </Media.Body>
    </Media>
    <h2>Word partner en sluit je aan met onze API</h2>
    <p>
      Hieronder vind je documentatie en het stappenplan om je aan te sluiten
      op ons platform.
    </p>
    <ul>
      <li>
        <a>
          Welkom bij de Tippiq open API.pdf
        </a>
      </li>
      <li>
        <a>
          Stappenplan.pdf
        </a>
      </li>
      <li>
        <a href="https://buurt.tippiq.nl/docs">
          Technische API documentatie
        </a>
      </li>
    </ul>
  </StaticPage>;

export default BecomeAPartner;
