import { filter } from 'lodash';

export default class IndEvent {
  constructor(props) {
    Object.assign(this, props);
    this.rsvpHref = `http://act.indivisible.org/event/local-actions/${this.id}/signup/`;
    const issueFocus = this.fields.filter(obj => obj.name === 'event_issue_focus');
    if (issueFocus.length > 0) {
      this.issueFocus = issueFocus[0].value;
    } else {
      this.issueFocus = 'Lawmaker event';
    }
  }
}
