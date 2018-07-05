const campaignMapping = {
  15: 'local-actions',
  21: 'save-scotus-actions',
  9: 'recess-townhall',
};

export default class IndEvent {
  constructor(props) {
    Object.assign(this, props);
    this.rsvpHref = this.makeUrl();
  }

  makeUrl() {
    const arr = this.campaign.split('/');
    const campaignNumber = arr[arr.length - 2];
    const campaignName = campaignMapping[campaignNumber] || 'local-actions';
    return `http://act.indivisible.org/event/${campaignName}/${this.id}/signup/`
  }
}
