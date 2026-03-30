(function () {
  "use strict";

  var container = document.getElementById("reviewboost-widget");
  if (!container) return;

  var widgetId = container.getAttribute("data-widget-id");
  if (!widgetId) return;

  var scriptTag = document.querySelector('script[src*="embed.js"]');
  var baseUrl = scriptTag
    ? scriptTag.src.replace(/\/embed\.js.*$/, "")
    : window.location.origin;

  function stars(rating, color) {
    var html = "";
    for (var i = 1; i <= 5; i++) {
      html +=
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="' +
        (i <= rating ? color : "none") +
        '" stroke="' +
        color +
        '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:' +
        (i <= rating ? "1" : "0.3") +
        '"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }
    return '<span style="display:inline-flex;gap:2px;">' + html + "</span>";
  }

  function avatar(name, primaryColor, bgColor) {
    return (
      '<span style="width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;background:' +
      primaryColor +
      ";color:" +
      bgColor +
      '">' +
      name.charAt(0) +
      "</span>"
    );
  }

  function renderCard(widget, reviews) {
    if (!reviews.length) return "<p>No reviews yet</p>";
    var r = reviews[0];
    return (
      '<div style="background:' +
      widget.background_color +
      ";color:" +
      widget.text_color +
      ';border-radius:12px;padding:24px;max-width:400px;font-family:system-ui,-apple-system,sans-serif;">' +
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="' +
      widget.primary_color +
      '" stroke-width="2" style="opacity:0.3;margin-bottom:12px;"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>' +
      stars(r.rating, widget.primary_color) +
      '<p style="margin:12px 0 0;font-size:14px;line-height:1.6;opacity:0.9;">' +
      r.body +
      "</p>" +
      '<div style="margin-top:16px;display:flex;align-items:center;gap:12px;">' +
      avatar(r.author_name, widget.primary_color, widget.background_color) +
      "<div>" +
      '<p style="font-size:14px;font-weight:600;margin:0;">' +
      r.author_name +
      "</p>" +
      '<p style="font-size:12px;opacity:0.6;margin:2px 0 0;">Verified Review</p>' +
      "</div></div></div>"
    );
  }

  function renderBadge(widget, reviews) {
    var avg =
      reviews.reduce(function (s, r) {
        return s + r.rating;
      }, 0) / (reviews.length || 1);
    return (
      '<div style="display:inline-flex;align-items:center;gap:16px;background:' +
      widget.background_color +
      ";color:" +
      widget.text_color +
      ";border:1px solid " +
      widget.primary_color +
      '33;border-radius:12px;padding:16px 24px;font-family:system-ui,-apple-system,sans-serif;">' +
      '<div style="display:flex;flex-direction:column;align-items:center;">' +
      '<div style="display:flex;align-items:center;gap:6px;">' +
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="' +
      widget.primary_color +
      '" stroke="' +
      widget.primary_color +
      '" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' +
      '<span style="font-size:28px;font-weight:700;">' +
      avg.toFixed(1) +
      "</span></div>" +
      stars(Math.round(avg), widget.primary_color) +
      "</div>" +
      '<div style="border-left:1px solid ' +
      widget.text_color +
      '20;padding-left:16px;height:48px;display:flex;flex-direction:column;justify-content:center;">' +
      '<p style="font-size:14px;font-weight:600;margin:0;">' +
      widget.business_name +
      "</p>" +
      '<p style="font-size:12px;opacity:0.6;margin:2px 0 0;">Based on ' +
      reviews.length +
      " review" +
      (reviews.length !== 1 ? "s" : "") +
      "</p></div></div>"
    );
  }

  function renderCarousel(widget, reviews) {
    if (!reviews.length) return "<p>No reviews yet</p>";
    var id = "rb-carousel-" + widgetId;
    var html =
      '<div id="' +
      id +
      '" style="background:' +
      widget.background_color +
      ";color:" +
      widget.text_color +
      ';border-radius:12px;padding:24px;max-width:480px;font-family:system-ui,-apple-system,sans-serif;">';

    html += '<div id="' + id + '-content"></div>';
    html +=
      '<div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:12px;">';
    html +=
      '<button id="' +
      id +
      '-prev" style="background:none;border:none;color:' +
      widget.text_color +
      ';cursor:pointer;padding:6px;border-radius:50%;opacity:0.7;">&#9664;</button>';
    html += '<span id="' + id + '-counter" style="font-size:12px;opacity:0.6;"></span>';
    html +=
      '<button id="' +
      id +
      '-next" style="background:none;border:none;color:' +
      widget.text_color +
      ';cursor:pointer;padding:6px;border-radius:50%;opacity:0.7;">&#9654;</button>';
    html += "</div></div>";

    setTimeout(function () {
      var current = 0;
      var contentEl = document.getElementById(id + "-content");
      var counterEl = document.getElementById(id + "-counter");
      var prevBtn = document.getElementById(id + "-prev");
      var nextBtn = document.getElementById(id + "-next");

      function show(idx) {
        var r = reviews[idx];
        if (!contentEl) return;
        contentEl.innerHTML =
          stars(r.rating, widget.primary_color) +
          '<p style="margin:12px 0 0;font-size:14px;line-height:1.6;opacity:0.9;min-height:60px;">' +
          r.body +
          "</p>" +
          '<div style="margin-top:12px;display:flex;align-items:center;gap:10px;">' +
          avatar(r.author_name, widget.primary_color, widget.background_color) +
          "<div>" +
          '<p style="font-size:14px;font-weight:600;margin:0;">' +
          r.author_name +
          "</p>" +
          '<p style="font-size:12px;opacity:0.6;margin:2px 0 0;">Verified Review</p>' +
          "</div></div>";
        if (counterEl)
          counterEl.textContent = idx + 1 + "/" + reviews.length;
      }

      if (prevBtn)
        prevBtn.onclick = function () {
          current = (current - 1 + reviews.length) % reviews.length;
          show(current);
        };
      if (nextBtn)
        nextBtn.onclick = function () {
          current = (current + 1) % reviews.length;
          show(current);
        };

      show(0);
      setInterval(function () {
        current = (current + 1) % reviews.length;
        show(current);
      }, 5000);
    }, 0);

    return html;
  }

  function renderGrid(widget, reviews) {
    if (!reviews.length) return "<p>No reviews yet</p>";
    var html =
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;font-family:system-ui,-apple-system,sans-serif;">';
    reviews.forEach(function (r) {
      html +=
        '<div style="background:' +
        widget.background_color +
        ";color:" +
        widget.text_color +
        ";border:1px solid " +
        widget.primary_color +
        '15;border-radius:12px;padding:20px;">' +
        stars(r.rating, widget.primary_color) +
        '<p style="margin:10px 0 0;font-size:14px;line-height:1.6;opacity:0.9;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;">' +
        r.body +
        "</p>" +
        '<div style="margin-top:12px;display:flex;align-items:center;gap:8px;">' +
        avatar(r.author_name, widget.primary_color, widget.background_color) +
        '<span style="font-size:13px;font-weight:500;">' +
        r.author_name +
        "</span></div></div>";
    });
    html += "</div>";
    return html;
  }

  function renderFloating(widget, reviews) {
    if (!reviews.length) return "<p>No reviews yet</p>";
    var avg =
      reviews.reduce(function (s, r) {
        return s + r.rating;
      }, 0) / (reviews.length || 1);
    var fid = "rb-floating-" + widgetId;
    var html =
      '<div id="' + fid + '-badge" style="cursor:pointer;display:inline-flex;align-items:center;gap:12px;background:' +
      widget.background_color +
      ";color:" +
      widget.text_color +
      ";border:1px solid " +
      widget.primary_color +
      '33;border-radius:999px;padding:12px 20px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.3);">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="' +
      widget.primary_color +
      '" stroke="' +
      widget.primary_color +
      '" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' +
      '<span style="font-weight:700;font-size:18px;">' +
      avg.toFixed(1) +
      "</span>" +
      '<span style="font-size:12px;opacity:0.6;">' +
      reviews.length +
      " review" +
      (reviews.length !== 1 ? "s" : "") +
      "</span></div>" +
      '<div id="' + fid + '-card" style="display:none;background:' +
      widget.background_color +
      ";color:" +
      widget.text_color +
      ";border:1px solid " +
      widget.primary_color +
      '33;border-radius:12px;width:320px;overflow:hidden;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.4);">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid ' +
      widget.primary_color +
      '22;">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="' +
      widget.primary_color +
      '" stroke="' +
      widget.primary_color +
      '" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' +
      '<span style="font-weight:700;font-size:14px;">' +
      (widget.business_name || "Reviews") +
      "</span></div>" +
      '<button id="' + fid + '-close" style="background:none;border:none;color:' +
      widget.text_color +
      ';cursor:pointer;opacity:0.6;font-size:18px;padding:2px 6px;">&#10005;</button></div>' +
      '<div id="' + fid + '-content" style="padding:16px;"></div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-top:1px solid ' +
      widget.primary_color +
      '22;">' +
      '<span id="' + fid + '-counter" style="font-size:11px;opacity:0.4;"></span>' +
      '<div style="display:flex;gap:4px;">' +
      '<button id="' + fid + '-prev" style="background:none;border:none;color:' +
      widget.text_color +
      ';cursor:pointer;padding:4px;opacity:0.7;">&#9664;</button>' +
      '<button id="' + fid + '-next" style="background:none;border:none;color:' +
      widget.text_color +
      ';cursor:pointer;padding:4px;opacity:0.7;">&#9654;</button>' +
      "</div></div></div>";

    setTimeout(function () {
      var badge = document.getElementById(fid + "-badge");
      var card = document.getElementById(fid + "-card");
      var closeBtn = document.getElementById(fid + "-close");
      var contentEl = document.getElementById(fid + "-content");
      var counterEl = document.getElementById(fid + "-counter");
      var prevBtn = document.getElementById(fid + "-prev");
      var nextBtn = document.getElementById(fid + "-next");
      var current = 0;

      function showReview(idx) {
        var r = reviews[idx];
        if (!contentEl) return;
        contentEl.innerHTML =
          stars(r.rating, widget.primary_color) +
          '<p style="margin:8px 0 0;font-size:14px;line-height:1.6;opacity:0.9;min-height:48px;">' +
          r.body +
          "</p>" +
          '<div style="margin-top:10px;display:flex;align-items:center;gap:8px;">' +
          avatar(r.author_name, widget.primary_color, widget.background_color) +
          '<span style="font-size:13px;font-weight:500;">' +
          r.author_name +
          "</span></div>";
        if (counterEl) counterEl.textContent = idx + 1 + "/" + reviews.length;
      }

      if (badge) badge.onclick = function () {
        badge.style.display = "none";
        card.style.display = "block";
        showReview(current);
      };
      if (closeBtn) closeBtn.onclick = function () {
        card.style.display = "none";
        badge.style.display = "inline-flex";
      };
      if (prevBtn) prevBtn.onclick = function () {
        current = (current - 1 + reviews.length) % reviews.length;
        showReview(current);
      };
      if (nextBtn) nextBtn.onclick = function () {
        current = (current + 1) % reviews.length;
        showReview(current);
      };
    }, 0);

    return html;
  }

  // Fetch widget data and render
  fetch(baseUrl + "/api/widget/" + widgetId + "?format=json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.error) {
        container.innerHTML =
          '<p style="color:#888;font-size:14px;">Widget not found</p>';
        return;
      }

      var widget = data.widget;
      var reviews = data.reviews;
      var html = "";

      switch (widget.style) {
        case "card":
          html = renderCard(widget, reviews);
          break;
        case "badge":
          html = renderBadge(widget, reviews);
          break;
        case "carousel":
          html = renderCarousel(widget, reviews);
          break;
        case "grid":
          html = renderGrid(widget, reviews);
          break;
        case "floating":
          html = renderFloating(widget, reviews);
          break;
        default:
          html = renderCard(widget, reviews);
      }

      // Render into shadow DOM to isolate styles
      if (container.attachShadow) {
        var shadow = container.attachShadow({ mode: "open" });
        shadow.innerHTML = html;
      } else {
        container.innerHTML = html;
      }

      // Track impression
      fetch(baseUrl + "/api/impressions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgetId: widgetId }),
      }).catch(function () {});
    })
    .catch(function () {
      container.innerHTML =
        '<p style="color:#888;font-size:14px;">Unable to load reviews</p>';
    });
})();
