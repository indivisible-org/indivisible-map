import { filter } from 'lodash';

export default class IndEvent {
  constructor(props) {
    Object.assign(this, props);
    this.rsvpHref = `http://act.indivisible.org/event/local-actions/${this.id}/signup/`;
    const issueFocus = this.fields.filter(obj => obj.name === 'event_issue_focus');
    const townHall = filter(this.fields, { name: 'meeting_type' });
    const walkout = filter(this.fields, { name: 'walkout_creator_type' });
    if (issueFocus.length > 0) {
      this.issueFocus = issueFocus[0].value;
    } else if (townHall.length > 0) {
      this.issueFocus = 'Town Hall';
    } else if (walkout.length > 0) {
      this.issueFocus = 'School Walkout';
    } else {
      this.issueFocus = 'Other';
    }
  }
}
