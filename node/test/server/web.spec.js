'use strict';
import request from 'supertest';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import shortid from 'shortid';
import express from 'express';
import portFinder from 'portfinder';

describe('Web', () => {
    const webSrc = '../../src/server/web';
    let initialiseApp;

    beforeEach(() => {
        initialiseApp = require(webSrc);
    });

    afterEach(() => {
        delete require.cache[require.resolve(webSrc)];
    });

    const TEXT_HTML_HEADER = 'text/html; charset=UTF-8';

    const verifyPageTitle = document => {
        const titles = document.querySelectorAll('head > title');
        expect(titles.length).to.equal(1);
        expect(titles[0].innerHTML).to.equal('DAZN :: themoviedb UI test');
    };

    const verifyPageMeta = document => {
        const metas = document.querySelectorAll('head > meta');
        expect(metas.length).to.equal(2);

        const charsetMeta = document.querySelectorAll('head > meta[charset="UTF-8"]');
        expect(charsetMeta.length).to.equal(1);

        const contentEquivalentMeta = document.querySelectorAll('head > meta[http-equiv="Content-Language"]');
        expect(contentEquivalentMeta.length).to.equal(1);
        expect(contentEquivalentMeta[0].content).to.equal('en');

    };

    const verifyPageProperties = document => {
        verifyPageTitle(document);
        verifyPageMeta(document);

        expect(document.querySelector('#app')).to.be.ok;
        expect(document.querySelector('#app').nodeName).to.equal('MAIN');
    };

    const verifyScriptsOnPage = document => {
        const headScripts = document.querySelectorAll('head > script');
        expect(headScripts.length).to.equal(0);

        const bodyScripts = document.querySelectorAll('body > script');
        expect(bodyScripts.length).to.equal(1);
        expect(bodyScripts[0].type).to.equal('text/javascript');
        expect(bodyScripts[0].src).to.equal('/public/js/app-bundle.js');
    };

    const verifyCSSOnPage = document => {
        const bodyCSS = document.querySelectorAll('body > link[rel="stylesheet"]');
        expect(bodyCSS.length).to.equal(0);

        const headCSS = document.querySelectorAll('head > link[rel="stylesheet"]');
        expect(headCSS).to.have.length(2);
        expect(headCSS[0].type).to.equal('text/css');
        expect(headCSS[0].href).to.equal('/public/css/reset.css');

        expect(headCSS[1].type).to.equal('text/css');
        expect(headCSS[1].href).to.equal('/public/css/style.css');
    };

    const verifyDefaultIndexPage = window => {
        const document = window.document;
        verifyPageProperties(document);
        verifyCSSOnPage(document);
        verifyScriptsOnPage(document);
    };

    it('should serve index page on GET', done => {
        request(initialiseApp(), {usable: true})
            .get('/')
            .expect(200)
            .expect('Content-Type', TEXT_HTML_HEADER)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                verifyDefaultIndexPage(new JSDOM(res.text).window);
                done();
            });
    });

    it('should serve index page on GET any page', done => {
        request(initialiseApp(), {usable: true})
            .get(`/${shortid()}`)
            .expect(200)
            .expect('Content-Type', TEXT_HTML_HEADER)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                verifyDefaultIndexPage(new JSDOM(res.text).window);
                done();
            });
    });
});
