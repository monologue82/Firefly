(function() {
  var dataEl = document.getElementById('site-stats-data');
  if (!dataEl) return;
  var siteStartDate = dataEl.dataset.siteStartDate;
  var lastPostDate = dataEl.dataset.lastPostDate || null;
  var todayText = dataEl.dataset.todayText;

  function updateDynamicStats() {
    var today = new Date();
    var startDate = new Date(siteStartDate);
    var diffTime = Math.abs(today.getTime() - startDate.getTime());
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.querySelectorAll('[data-stat-id="running-days"]').forEach(function(el) {
      el.textContent = diffDays.toString();
    });
    if (lastPostDate) {
      var lastPost = new Date(lastPostDate);
      var timeSinceLastPost = Math.abs(today.getTime() - lastPost.getTime());
      var daysSinceLastUpdate = Math.floor(timeSinceLastPost / (1000 * 60 * 60 * 24));
      document.querySelectorAll('[data-stat-id="last-update"]').forEach(function(el) {
        if (daysSinceLastUpdate === 0) {
          el.textContent = todayText;
          if (el.nextElementSibling) el.nextElementSibling.style.display = 'none';
        } else {
          el.textContent = daysSinceLastUpdate.toString();
          if (el.nextElementSibling) el.nextElementSibling.style.display = '';
        }
      });
    }
  }
  updateDynamicStats();
  document.addEventListener("swup:contentReplaced", function() {
    setTimeout(updateDynamicStats, 100);
  });

  function updateVisitCount() {
    var pvEl = document.getElementById('busuanzi_value_site_pv');
    var visitEls = document.querySelectorAll('[data-stat-id="visit-count"]');
    if (pvEl && visitEls.length > 0) {
      var count = pvEl.textContent || '0';
      visitEls.forEach(function(el) {
        el.textContent = count.replace(/,/g, '').replace(/ /g, '');
      });
    }
  }
  if (document.readyState === 'complete') {
    setTimeout(updateVisitCount, 500);
  } else {
    window.addEventListener('load', function() {
      setTimeout(updateVisitCount, 500);
    });
  }
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      setTimeout(updateVisitCount, 300);
    }
  });
})();
