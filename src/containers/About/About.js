/**
 * About container.
 * @module components/About
 */

import React from 'react';
import { StaticPage } from '../../containers';

/**
 * About component.
 * @function About
 * @returns {string} Markup of the about page.
 */
const About = () =>
  <StaticPage title="Over Tippiq" id="page-about">
    <h1>Welkom bij Tippiq Buurt!</h1>
    <p>
      Rond ieder huis gebeurt wat. Een buurman kan wat hulp gebruiken bij het doen van
      boodschappen, een buurvrouw biedt een ladder aan of er vinden wegwerkzaamheden
      plaats waardoor je even niet voor de deur kunt parkeren. Kortom, het is handig
      om op de hoogte te blijven van wat er in jouw buurt speelt.
    </p>
    <p>
      Met Tippiq Buurt ontvang je de buurtinformatie die jij wilt.
      In het Buurtoverzicht en in je Buurtbericht vind je het laatste buurtnieuws en
      ben je altijd voorbereid op werkzaamheden, kun je jouw buur een handje helpen of
      vertrouwd een auto huren voor weinig.
    </p>
    <p>
      Je krijgt handige en belangrijke informatie te zien van onze partners.
      En weet je precies wat er rond jouw huis gebeurt, gevraagd en aangeboden wordt.
    </p>
    <h2>Een initatief van Alliander</h2>
    <p>
      Tippiq Buurt is een initiatief van netwerkbedrijf Alliander.
      Alliander zorgt ervoor dat je energiediensten kunt kiezen en dat deze werken,
      maar de wereld van energie verandert. Kantoren, woningen en andere gebouwen
      gaan een belangrijke rol spelen bij het produceren van energie.
      Ook de manier waarop met energie wordt omgegaan zal hierdoor veranderen.
      We vinden het daarbij belangrijk dat de bewoner bepaalt hoe dit gebeurt.
    </p>
    <p>
      Een belangrijk aspect daarbij is inzicht, want zonder inzicht geen controle.
      Met Tippiq Buurt geven we je dat inzicht rond jouw huis en kun je als bewoner
      bepalen wat je aan- en uitzet qua informatie die je ontvangt.
      Nu doe je dat om een auto of boormachine te delen,
      straks misschien om hetzelfde te doen met je energie.
    </p>
  </StaticPage>;

export default About;
