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
  }

  addToc = () => {
    this.doc.insertPage((this.cover) ? 2 : 1);
    this.setHeader();
    this.doc.setFontSize(14);
    let title = 'Inhaltsverzeichnis';
    if (getLanguage() === 'en') title = 'Table of contents';
    this.doc.text(title.replace('’', '\''), this.border, this.yBarOffset + 2);
    this.yBarOffset = this.yBarOffset + 15;
    this.doc.setFontSize(12);
    this.toc.forEach((t) => {
      const text = (t.content) ? t.content.replace('’', '\'') : '';
      this.doc.text(text, this.border + 20, this.yBarOffset + 2);
      this.doc.text(t.pageNumber.toString(), this.width - this.border, this.yBarOffset + 2, 'right');
      this.yBarOffset = this.yBarOffset + 8;
    });
  }

  addPageContent = (content) => {
    this.doc.setFontSize(14);
    const t = { content, pageNumber: this.actualPage };
    this.toc.push(t);
    this.doc.text(content.replace('’', '\''), this.border, this.yBarOffset + 2);
    this.yBarOffset = this.yBarOffset + 10;
  }

  // set PDF Header including date
  setHeader = () => {
    const b = this.border;
    this.doc.setFontSize(8);
    const { header } = this || '';
    const text = header.replace('’', '\'');
    this.doc.text(text, b, b);
    if (this.date) {
      this.doc.text(moment(new Date()).format('DD.MM.YYYY'), this.width - b, b, 'right');
    }
    this.doc.setDrawColor(8, 48, 107);
    this.doc.line(b, b + 2, this.width - b, b + 2);
    this.yBarOffset = this.border + 8;
  }

  // set PDF Footer including text and page number
  setFooter = () => {
    const x = this.border;
    const y = this.height - this.border;
    this.doc.setFontSize(8);
    const { footer } = this || '';
    const text = footer.replace('’', '\'');
    this.doc.text(text, x, y);
    if (this.page) {
      const pageString = `${this.actualPage}`;
      this.doc.text(pageString, this.width - x, y, 'right');
    }
    this.doc.setDrawColor(8, 48, 107);
    this.doc.line(x, y - 4, this.width - x, y - 4);
  }

  // check if we have to do a page break
  checkPageBreak = (barHeight) => {
    // check if we have to paint the new chart on a new page
    if (this.yBarOffset + barHeight > (this.height - this.border)) {
      this.addPage();
      return true;
    }
    return false;
  }

  // add cover
  addCover = (coverImage, logo, logoRatio, color, client) => {
    this.doc.setFontSize(20);

    // // rectangle
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.rect(20, 50, this.width - 40, 180, 'F');
    let coverTitle = 'Realfeedback - 360 Grad Feedbackanalyse';
    if (getLanguage() === 'en') coverTitle = 'Realfeedback - 360 Degrees Feedback Analysis';
    this.doc.text(coverTitle.replace('’', '\''), this.width / 2, 30, 'center');

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
    this.doc.text(client.replace('’', '\''), this.width / 2, 230, 'center');

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
    this.doc.text(partner.replace('’', '\''), this.width - 25, y, 'right');
    this.doc.text(moment(new Date()).format('DD.MM.YYYY'), this.width - 25, y + 8, 'right');
  }

  addDescription = (description) => {
    const t = `<div style="font-family: Helvetica">${description}</div>`;
    const margins = {
      top: this.border + 16,
      bottom: 60,
      left: this.border,
      width: this.width - (2 * this.border),
    };
    this.doc.fromHTML(t, margins.left, margins.top, { width: margins.width, bottom: 60 });
  }

  // add a new Radar chart
  addRadarChart = (chart) => {
    const ratio = (chart.height / chart.width);
    const barHeight = ratio * this.width;

    this.checkPageBreak(barHeight);

    // draw the new chart
    this.doc.setFontSize(10);
    this.doc.addImage(
      chart.toBase64Image(),
      'JPEG',
      this.border,
      this.yBarOffset,
      this.width - (2 * this.border),
      barHeight - this.border,
      undefined,
      'FAST',
    );
    this.yBarOffset = this.yBarOffset + (barHeight - (this.border / 2));
  }

  addLine = () => {
    // draw a line after every Chart
    this.doc.line(
      this.border,
      this.yBarOffset - (this.border / 4),
      this.width - this.border,
      this.yBarOffset - (this.border / 4),
    );
  }

  // add a remarks
  addRemarks = (remark) => {
    const width = this.width - (2 * this.border);
    const textArray = remark.map(r => (r.remark) ? r.remark.replace('’', '\'') : ''); // eslint-disable-line
    const splitLabel = this.doc.splitTextToSize(textArray, width);
    const height = splitLabel.length * 4;
    this.checkPageBreak(height + (this.border / 2));
    this.doc.setFontSize(10);
    this.doc.text(this.border, this.yBarOffset, splitLabel);
    this.yBarOffset = this.yBarOffset + (height + (this.border / 2));
  }

  // add a new Bar chart
  addBarChart = (context, chart, label = '') => {
    const ratio = (chart.height / chart.width);

    const imageWidth = this.width - (2 * this.border) - this.xBarOffset;
    const barHeight = imageWidth * ratio;

    const contextHeight = (context && context !== '') ? 8 : 0;

    this.checkPageBreak(barHeight + this.border + contextHeight);

    if (context && context !== '') {
      this.doc.setFontSize(12);
      this.doc.text(this.border, this.yBarOffset + 2, context.replace('’', '\''));
      this.yBarOffset = this.yBarOffset + contextHeight;
    }

    // draw the new chart
    this.doc.setFontSize(10);
    const t = label.replace('’', '\'');
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
  }

  // save PDF
  save = (filename = 'eeboo.pdf') => {
    this.doc.save(filename);
  }
}

export default PDF;
