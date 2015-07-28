/*
 * jQuery SwitchView Plugin v1.0
 * http://webdesign-dackel.com/dev/switchview/
 *
 * Copyright 2013 Tsuyoshi Wada.
 * Released under the MIT license
 */
(function(e, t, n) {
    function f(e) {
        return encodeURIComponent(e)
    }

    function l(e) {
        return decodeURIComponent(e)
    }

    function c(e) {
        return e.replace(/(^\s+)|(\s+$)/g, "")
    }

    function h(e) {
        return e.indexOf('"') == 0 ? e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\") : e
    }

    function p(e) {
        return f(String(e))
    }

    function d(e) {
        var t = new Date;
        t.setDate(t.getDate() + e);
        return t.toUTCString()
    }

    function v() {
        var t = e.navigator.userAgent.toLowerCase();
        if (t.indexOf("iphone") > 0 || t.indexOf("ipod") > 0 || t.indexOf("android") > 0 && t.indexOf("Mobile") > 0) {
            return "sp"
        } else if (t.indexOf("ipad") > 0 || t.indexOf("android") > 0) {
            return "tb"
        } else {
            return "pc"
        }
    }

    function m(e, t, n, r, i, o) {
        if (!e) return;
        var u = g("meta", {
            name: "viewport",
            content: [t ? "width=" + t : "width=1024", n ? ", initial-scale=" + n : "", r ? ", minimum-scale=" + r : "", i ? ", maximum-scale=" + i : "", ", user-scalable=" + (o ? "yes" : "no")].join("")
        });
        s.appendChild(u)
    }

    function g(e, t) {
        var n = document.createElement(e),
            r;
        t = t || {};
        for (r in t) {
            n.setAttribute(r, t[r])
        }
        return n
    }

    function y() {
        var e = new Date,
            t = e.getTime(),
            n = Math.floor(Math.random() * 1e3);
        return n + t.toString()
    }

    function b(e) {
        if (typeof e == "string") return t(e);
        else return e
    }
    var r = "switchView",
        i = null,
        s = document.getElementsByTagName("head")[0];
    var o = "click." + r;
    var u = {
        expires: 1,
        path: "/",
        secure: false,
        domain: false,
        initialScale: 1,
        minScale: 1,
        maxScale: 1,
        scalable: false,
        spWidth: "device-width",
        spDefault: "sp",
        spViewTrigger: "#spView",
        pcViewTrigger: "#pcView",
        cache: true,
        confirm: false,
        confirmMessage: "スマートフォン向けサイトに移動しますか？",
        isTabletSp: true,
        spDir: "sp",
        cssDir: "css",
        suffix: "_sp"
    };
    var a = function() {
        this.initialize.apply(this, arguments)
    };
    a.prototype = {
        version: "1.0",
        options: {},
        cookies: [],
        cssList: [],
        device: "pc",
        initialize: function(e, s) {
            this.cssList = e || [];
            this.options = s;
            this.getAllCookie();
            this.device = v();
            if (this.device == "tb") {
                this.device = this.options.isTabletSp ? "sp" : "pc"
            }
            if (this.getCookie(r) == n) {
                if (this.options.confirm && this.viewType() == "sp") {
                    if (confirm(this.options.confirmMessage)) {
                        this.setCookie(r, "sp");
                        location.reload()
                    } else {
                        this.setCookie(r, "pc")
                    }
                } else {
                    this.setCookie(r, this.viewType())
                }
            }
            m(this.viewType() == "sp", this.options.spWidth, this.options.initialScale, this.options.minScale, this.options.maxScale, this.options.scalable);
            this.loadCSS();
            t(function() {
                b(i.options.pcViewTrigger).bind(o, i.toPcView);
                b(i.options.spViewTrigger).bind(o, i.toSpView)
            })
        },
        viewType: function() {
            var e = this.getCookie(r);
            if (e == n) {
                return this.options.spDefault == "sp" && this.device == "sp" ? "sp" : "pc"
            } else {
                return e == "sp" && this.device == "sp" ? "sp" : "pc"
            }
        },
        loadCSS: function(e) {
            e = e || [];
            this.cssList = this.cssList.concat(e);
            for (var t = 0; t < this.cssList.length; t++) {
                var n = g("link", {
                    rel: "stylesheet",
                    type: "text/css",
                    href: this.convertHref(this.cssList[t])
                });
                s.appendChild(n)
            }
        },
        convertHref: function(e) {
            var t, n = "";
            if (e.indexOf(this.options.cssDir + "/") > -1) {
                t = new RegExp("(.*)" + this.options.cssDir + "/", "g");
                n = "$1" + this.options.cssDir + "/" + this.options.spDir + "/"
            } else {
                t = new RegExp("(.*).css");
                n = "$1" + this.options.suffix + ".css"
            }
            e = this.viewType() == "pc" ? e : e.replace(t, n);
            return !this.options.cache ? e + "?" + y() : e
        },
        toPcView: function() {
            i.setCookie(r, "pc");
            location.reload()
        },
        toSpView: function() {
            i.setCookie(r, "sp");
            location.reload()
        },
        getAllCookie: function() {
            var e = [],
                t = document.cookie,
                n = [],
                r = [];
            if (t != "") {
                n = t.split(";");
                for (var i = 0; i < n.length; i++) {
                    r = n[i].split("=");
                    var s = c(l(r[0]));
                    e[s] = h(r[1])
                }
            }
            this.cookies = e;
            return this
        },
        getCookie: function(e) {
            return this.cookies[e]
        },
        setCookie: function(e, t) {
            document.cookie = [f(e) + "=" + p(t), this.options.expires ? "; expires=" + d(this.options.expires) : "", this.options.path ? "; path=" + this.options.path : "", this.options.domain ? "; domain=" + this.options.domain : "", this.options.secure ? "; secure" : ""].join("");
            return this.getAllCookie()
        },
        removeCookie: function(e) {
            var t = this.options.expires;
            this.options.expires = -1;
            this.setCookie(e, "");
            this.options.expires = t;
            return this.getAllCookie()
        }
    };
    t[r] = function(e, n) {
        if (!i) {
            i = new a(e, t.extend({}, u, n))
        }
        return i
    }
})(window, jQuery)