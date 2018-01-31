export default class IndEvent {
  constructor(props) {
    Object.assign(this, props);
    this.issueFocus = this.fields[0].value.includes('http') ? 'Lawmaker event' : this.fields[0].value;
  }
}
