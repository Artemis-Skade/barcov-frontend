export class Locality {

    constructor(options = {}) {
        this.cname = typeof options.cname !== "undefined" ? options.cname : "";
        this.rcname = typeof options.rcname !== "undefined" ? options.rcname : "";
        this.zip = typeof options.zip !== "undefined" ? options.zip : "";
        this.town = typeof options.town !== "undefined" ? options.town : "";
        this.street = typeof options.street !== "undefined" ? options.street : "";
        this.package = typeof options.package !== "undefined" ? options.package : "none";

        this.isMember = typeof options.isMember !== "undefined" ? options.isMember : false;
        this.memberId = typeof options.memberId !== "undefined" ? options.memberId : "";

        this.otherAddress = typeof options.otherAddress !== "undefined" ? options.otherAddress : false;
        this.rname = typeof options.rname !== "undefined" ? options.rname : '';
        this.rtown = typeof options.rtown !== "undefined" ? options.rtown : '';
        this.rstreet = typeof options.rstreet !== "undefined" ? options.rstreet : '';
        this.rzip = typeof options.rzip !== "undefined" ? options.rzip : '';

        this.flyer_package = typeof options.flyer_package !== "undefined" ? options.flyer_package : 0;
        this.table_count = typeof options.table_count !== "undefined" ? options.table_count : 5;
    }

}
