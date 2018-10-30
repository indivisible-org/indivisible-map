const campaignMapping = {
  15: 'local-actions',
  19: 'mobilizeamerica-public-events',
  21: 'save-scotus-actions',
  9: 'recess-townhall',
};

export default class IndEvent {
  constructor(props) {
    Object.assign(this, props);
    this.rsvpHref = this.makeUrl();
  }

  makeUrl() {
    if (this.displayAltLink) {
      return this.linkToInfo;
    }
    if (campaignMapping[this.campaignNo] === 'mobilizeamerica-public-events' && this.linkToInfo) {
      return this.linkToInfo;
    }
    const arr = this.campaign.split('/');
    const campaignNumber = arr[arr.length - 2];
    const campaignName = campaignMapping[campaignNumber] || 'local-actions';
    return `http://act.indivisible.org/event/${campaignName}/${this.id}/signup/`;
  }
}
