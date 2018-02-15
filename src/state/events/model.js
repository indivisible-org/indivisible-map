export default class IndEvent {
  constructor(props) {
    Object.assign(this, props);
    console.log(props.groupName);
    this.rsvpHref = `http://act.indivisible.org/event/local-actions/${this.id}/signup/`;
    this.issueFocus = this.fields[0].value.includes('http') ? 'Lawmaker event' : this.fields[0].value;
  }
}
