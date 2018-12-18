import jsPDF from 'jspdf';
import moment from 'moment';

export class PDF {
  constructor(header = '', date = true, footer = '', page = true) {
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
    this.setHeader();
    this.setFooter();
  }

  // add a new page to the document
  addPage = () => {
    this.yBarOffset = 0;
    this.doc.addPage();
    this.actualPage += 1;
    this.setHeader();
    this.setFooter();
  }

  // set PDF Header including date
  setHeader = () => {
    const b = this.border;
    this.doc.setFontSize(8);
    this.doc.text(this.header, b, b);
    if (this.date) {
      this.doc.text(moment(new Date()).format('DD.MM.YYYY'), this.width - b, b, 'right');
    }
    this.doc.setDrawColor(8, 48, 107);
    this.doc.line(b, b + 2, this.width - b, b + 2);
    this.yBarOffset = this.border + 5;
  }

  // set PDF Footer including text and page number
  setFooter = () => {
    const x = this.border;
    const y = this.height - this.border;
    this.doc.setFontSize(8);
    this.doc.text(this.footer, x, y);
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
    const textArray = remark.map(r => r.remark);
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
      this.doc.text(this.border, this.yBarOffset + 2, context);
      this.yBarOffset = this.yBarOffset + contextHeight;
    }

    // draw the new chart
    this.doc.setFontSize(10);
    const splitLabel = this.doc.splitTextToSize(label, this.xBarOffset);
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
