export default class IndEvent {
  constructor(props) {
    Object.assign(this, props);
    this.rsvpHref = `http://act.indivisible.org/event/local-actions/${this.id}/signup/`;
  }
}
