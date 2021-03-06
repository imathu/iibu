import jsPDF from 'jspdf';
import moment from 'moment';

import { getLanguage } from 'utils/language';

export class PDF {
  constructor(header = '', date = false, footer = '', page = true, cover = false) {
    this.header = header;
    this.footer = footer;
    this.date = date;
    this.page = page;
    this.doc = new jsPDF("p", "mm", "a4", true); // eslint-disable-line
    this.width = this.doc.internal.pageSize.getWidth();
    this.height = this.doc.internal.pageSize.getHeight();
    this.border = 20; // pdf page border
    this.actualPage = 1; // current page number
    this.yBarOffset = 0; // the y offset where the next bar will be painted
    this.xBarOffset = 50; // the x offset where each bar will be painted
    this.firstContentPage = null; // use this to add TOC before this page
    this.toc = [];
    this.cover = cover;
    if (!cover) {
      this.setHeader();
      this.setFooter();
    }
  }

  // add a new page to the document
  addPage = () => {
    this.pageOffset += 1;
    this.yBarOffset = 0;
    this.doc.addPage();
    this.actualPage += 1;
    this.setHeader();
    this.setFooter();
  };

  fixQuote = str => (
    str.replace('’', '\'').replace('“', '"').replace('„', '"')
  );

  addToc = () => {
    this.doc.insertPage((this.cover) ? 2 : 1);
    this.setHeader();
    this.doc.setFontSize(14);
    let title = 'Inhaltsverzeichnis';
    if (getLanguage() === 'en') title = 'Table of contents';
    this.doc.text(this.fixQuote(title), this.border, this.yBarOffset + 2);
    this.yBarOffset = this.yBarOffset + 15;
    this.doc.setFontSize(12);
    this.toc.forEach((t) => {
      const text = (t.content) ? this.fixQuote(t.content) : '';
      this.doc.text(text, this.border + 20, this.yBarOffset + 2);
      this.doc.text(t.pageNumber.toString(), this.width - this.border, this.yBarOffset + 2, 'right');
      this.yBarOffset = this.yBarOffset + 8;
    });
  };

  addPageContent = (content) => {
    this.doc.setFontSize(14);
    const t = { content, pageNumber: this.actualPage };
    this.toc.push(t);
    this.doc.text(this.fixQuote(content), this.border, this.yBarOffset + 2);
    this.yBarOffset = this.yBarOffset + 10;
  };

  // set PDF Header including date
  setHeader = () => {
    const b = this.border;
    this.doc.setFontSize(8);
    const { header } = this || '';
    const text = this.fixQuote(header);
    this.doc.text(text, b, b);
    if (this.date) {
      this.doc.text(moment(new Date()).format('DD.MM.YYYY'), this.width - b, b, 'right');
    }
    this.doc.setDrawColor(8, 48, 107);
    this.doc.line(b, b + 2, this.width - b, b + 2);
    this.yBarOffset = this.border + 8;
  };

  // set PDF Footer including text and page number
  setFooter = () => {
    const x = this.border;
    const y = this.height - this.border;
    this.doc.setFontSize(8);
    const { footer } = this || '';
    const text = this.fixQuote(footer);
    this.doc.text(text, x, y);
    if (this.page) {
      const pageString = `${this.actualPage}`;
      this.doc.text(pageString, this.width - x, y, 'right');
    }
    this.doc.setDrawColor(8, 48, 107);
    this.doc.line(x, y - 4, this.width - x, y - 4);
  };

  // check if we have to do a page break
  checkPageBreak = (barHeight) => {
    // check if we have to paint the new chart on a new page
    if (this.yBarOffset + barHeight > (this.height - this.border)) {
      this.addPage();
      return true;
    }
    return false;
  };

  // check if is the laste Element on this page, if we add one more.
  checkLastBeforePageBreak =
    barHeight => this.yBarOffset + (barHeight) > (this.height - this.border);

  // add cover
  addCover = (coverImage, logo, logoRatio, color, client) => {
    this.doc.setFontSize(20);

    // // rectangle
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.rect(20, 50, this.width - 40, 180, 'F');
    let coverTitle = 'Realfeedback - 360 Grad Feedbackanalyse';
    if (getLanguage() === 'en') coverTitle = 'Realfeedback - 360 Degrees Feedback Analysis';
    this.doc.text(this.fixQuote(coverTitle), this.width / 2, 30, 'center');

    // cover image
    this.doc.addImage(
      coverImage,
      'JPEG',
      30,
      80,
      this.width - 60,
      120,
      undefined,
      'FAST',
    );

    // feedbacker name
    this.doc.setFillColor(254, 254, 254);
    this.doc.setDrawColor(color[0], color[1], color[2]);
    this.doc.setLineWidth(1);
    this.doc.rect(40, 220, this.width - 80, 20, 'FD');
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.setFontSize(15);
    this.doc.text(this.fixQuote(client), this.width / 2, 230, 'center');

    // logo
    // TODO: only works for skillsgarden logo
    this.doc.addImage(
      logo,
      'PNG',
      25,
      260,
      40,
      40 / logoRatio,
      undefined,
      'FAST',
    );
    this.doc.setFontSize(12);
    let partner = 'Ihr Partner für Persönlichkeitsentwicklung';
    if (getLanguage() === 'en') partner = 'Your partner for personal development';
    const y = 262 + ((40 / logoRatio) / 2);
    this.doc.text(this.fixQuote(partner), this.width - 25, y, 'right');
    this.doc.text(moment(new Date()).format('DD.MM.YYYY'), this.width - 25, y + 8, 'right');
  };

  addDescription = (descriptions) => {
    descriptions.forEach((description, index) => {
      const t = `<div style="font-family: Helvetica">${description}</div>`;
      const margins = {
        top: index === 0 ? this.border + 16 : this.border + 2,
        bottom: 60,
        left: this.border,
        width: this.width - (2 * this.border),
      };
      this.doc.fromHTML(t, margins.left, margins.top, { width: margins.width, bottom: 60 });
      if (index < descriptions.length - 1) {
        this.addPage();
      }
    });
  };

  // add a new Radar chart
  addRadarChart = (chart) => {
    const ratio = (chart.height / chart.width);
    const barHeight = ratio * this.width;
    const halfBorder = 0.5 * this.border;

    this.checkPageBreak(barHeight);

    // draw the new chart
    this.doc.setFontSize(10);
    this.doc.addImage(
      chart.toBase64Image(),
      'JPEG',
      -1,
      this.yBarOffset,
      (this.width - (halfBorder)),
      barHeight,
      undefined,
      'FAST',
    );
    this.yBarOffset = this.yBarOffset + (barHeight - (this.border / 2));
  };

  addLine = () => {
    // draw a line after every Chart
    this.doc.line(
      this.border,
      this.yBarOffset - (this.border / 4),
      this.width - this.border,
      this.yBarOffset - (this.border / 4),
    );
  };

  // add a remarks
  addRemarks = (remark) => {
    const width = this.width - (2 * this.border);
    const textArray = remark.map(r => (r.remark) ? this.fixQuote(r.remark) : ''); // eslint-disable-line
    const splitLabel = this.doc.splitTextToSize(textArray, width);
    const height = splitLabel.length * 4;
    this.checkPageBreak(height + (this.border / 2));
    this.doc.setFontSize(10);
    this.doc.text(this.border, this.yBarOffset, splitLabel);
    this.yBarOffset = this.yBarOffset + (height + (this.border / 2));
  };

  // add a new Bar chart
  addBarChart = (context, chart, label = '') => {
    const ratio = (chart.height / chart.width);

    const imageWidth = this.width - (2 * this.border) - this.xBarOffset;
    const barHeight = imageWidth * ratio;

    const contextHeight = (context && context !== '') ? 8 : 0;

    this.checkPageBreak(barHeight + this.border + contextHeight);

    if (context && context !== '') {
      this.doc.setFontSize(12);
      this.doc.text(this.border, this.yBarOffset + 2, this.fixQuote(context));
      this.yBarOffset = this.yBarOffset + contextHeight;
    }

    // draw the new chart
    this.doc.setFontSize(10);
    const t = this.fixQuote(label);
    const splitLabel = this.doc.splitTextToSize(t, this.xBarOffset);
    this.doc.text(this.border, this.yBarOffset + 5, splitLabel);
    this.doc.addImage(
      chart.toBase64Image(),
      'JPEG',
      this.border + this.xBarOffset,
      this.yBarOffset,
      imageWidth,
      barHeight,
      undefined,
      'FAST',
    );
    this.yBarOffset = this.yBarOffset + (barHeight + this.border);
    return !this.checkLastBeforePageBreak(barHeight);
  };

  // save PDF
  save = (filename = 'eeboo.pdf') => {
    this.doc.save(filename);
  }
}

export default PDF;
