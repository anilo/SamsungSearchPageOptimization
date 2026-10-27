/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function ($, document, undefined) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return unRfc2068(decodeURIComponent(s.replace(pluses, ' ')));
	}

	function unRfc2068(value) {
		if (value.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		return value;
	}

	function fromJSON(value) {
		return config.json ? JSON.parse(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (value === null) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? null : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = fromJSON(cookie);
				break;
			}

			if (!key) {
				result[name] = fromJSON(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== null) {
			$.cookie(key, null, options);
			return true;
		}
		return false;
	};

})(jQuery, document);
(function () {
  'use strict';

  // Initialize Pd21Modules if it doesn't already exist
  window.sg = window.sg || {};
  window.sg.components = window.sg.components || {};
  window.sg.components.Pd21Modules = window.sg.components.Pd21Modules || {};

  // Attach to Pd21Modules
  window.sg.components.Pd21Modules = {
    State: null,
    Utils: null,
    CategoryUtils: null,
    ApiService: null,
    Filters: null,
    EddFilters: null,
    ConfirmPopup: null,
    ComparePopup: null,
    ComparePopupComponent: null,
    CompareBar: null,
    Sort: null,
  };
})();
(function ($) {
  'use strict';

  const CategoryUtils = (function ($) {
    function isMonitorPage() {
      const pfCategoryGroupName = $("#pfCategoryGroupName").val();
      const productTypeCodeName = $('#productTypeCodeName').val();
      let isMonitorPage = pfCategoryGroupName?.includes('Display') && productTypeCodeName?.includes('Monitors')
      return isMonitorPage;
    }

    function isMobilePage() {
      const pfCategoryGroupName = $("#pfCategoryGroupName").val();
      let isMobile = pfCategoryGroupName?.includes('Mobile') || false;
      return isMobile;
    }

    function isHEPage() {
      const pfCategoryGroupName = $("#pfCategoryGroupName").val();
      let isHE = pfCategoryGroupName?.includes('Television') || false;
      return isHE;
    }

    function isMemoryStoragePage() {
      const pfCategoryGroupName = $("#pfCategoryGroupName").val();
      let isMemoryStoragePage = pfCategoryGroupName?.includes('Memory Storage') || false;
      return isMemoryStoragePage;
    }

    function isHAPage() {
      const pfCategoryGroupName = $("#pfCategoryGroupName").val();
      let isHA = pfCategoryGroupName?.includes('Home Appliances') || false;
      return isHA;
    }

    function isAccessoriesPage() {
      const productTypeCodeName = $('#productTypeCodeName').val();
      return productTypeCodeName?.toLowerCase()?.includes('accessories');
    }

    function isVacuumsPage() {
      const pfCategoryGroupName = $("#pfCategoryGroupName").val();
      const productTypeCodeName = $('#productTypeCodeName').val();
      let isVacuumsPage = pfCategoryGroupName?.includes('Home Appliances') && productTypeCodeName?.includes('Vacuum Cleaners')
      return isVacuumsPage;
    }

    function isBundlePage() {
      const pfCategoryGroupName = $("#pfCategoryGroupName").val();
      let isBundlePage = pfCategoryGroupName?.includes('Package');
      return isBundlePage;
    }

    function isAudioPage() {
      const pfCategoryGroupName = $("#pfCategoryGroupName").val();
      let isAudioPage = pfCategoryGroupName?.includes('Audio');
      return isAudioPage;
    }

    return {
      isHAPage: isHAPage,
      isMemoryStoragePage: isMemoryStoragePage,
      isMonitorPage: isMonitorPage,
      isMobilePage: isMobilePage,
      isHEPage: isHEPage,
      isAccessoriesPage: isAccessoriesPage,
      isVacuumsPage: isVacuumsPage,
      isBundlePage: isBundlePage,
      isAudioPage: isAudioPage,
    };
  })($);

  // Attach to pd21Modules
  const pd21Modules = window.sg.components.Pd21Modules;
  pd21Modules.CategoryUtils = CategoryUtils;

})(window.jQuery);
(function ($) {
  'use strict';

  const pd21Modules = window.sg.components.Pd21Modules;
  const categoryUtils = pd21Modules.CategoryUtils;

  const is_DA_Page = categoryUtils.isHEPage() || categoryUtils.isHAPage();
  const is_VD_Page = categoryUtils.isMonitorPage() || categoryUtils.isMemoryStoragePage();
  const is_MX_page = categoryUtils.isMobilePage();
  const isHomeAppliances = categoryUtils.isHAPage();
  const isBundlePage = categoryUtils.isBundlePage();
  const isAudioPage = categoryUtils.isAudioPage();

  const showEddFilter = (is_DA_Page || is_VD_Page || isHomeAppliances || isBundlePage || isAudioPage) && !categoryUtils.isVacuumsPage();

  const Utils = (function ($) {
    const domainName = "https://mues1-org.ecom-qa.samsung.com";

    let scrollFlag = false;
    let currentPos = 0;

    function getCookie(e) {
      return $.cookie(e);
    }
    function deleteCookie(e, o, t) {
      t = "samsung.com",
        getCookie(e) && (document.cookie = e + "=" + (o ? ";path=" + o : "") + (t ? ";domain=" + t : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT")
    }

    function getViewPort() {
      let doc = window;
      let pre = 'inner';

      if (!('innerWidth' in window)) {
        pre = 'client';
        doc = document.documentElement || document.body;
      }

      return {
        width: doc[`${pre}Width`],
        height: doc[`${pre}Height`],
      };
    }

    function getCurrentDevice() {
      const constants = {
        BREAKPOINTS: {
          MOBILE: 534,
        }
      }

      const width = getViewPort().width;
      return width > constants.BREAKPOINTS.MOBILE ? 'desktop' : 'mobile';
    }

    const isNotNull = function (_str) {
      return !fnIsNull(_str);
    };

    const escapeHtml = function (text) {
      let newText = text;
      if (isNotNull(newText)) {
        newText = newText
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, '&quot;')
          .replace(/'/g, "&#039;");
      }
      return newText;
    };

    // truncateText function: to add ellipses whenever the text exceeds the specified character limit.
    function truncateText(txt, maxChars = 100) {
      if (!txt) return "";

      let text = String(txt);
      if (text.length > maxChars) {
        text = text.slice(0, maxChars) + '...';
      }
      return text;
    };

    function generateCheckboxId(filterName, filterOptionName, idx) {
      const toValidId = (str) => str?.toLowerCase().trim().replace(/[^\w\-]+/g, '-').replace(/\s+/g, '-') || '';
      const checkboxId = `${toValidId(filterName)}-${toValidId(filterOptionName)}`;
      return `checkbox-series-${checkboxId}-option-${idx}`;
    }

    function chipKeyProvider(updatedResponse) {
      updatedResponse.forEach((product) => {
        const initialBindData = product.groupedProductList.filter((innerEL) => innerEL.id == product.id)

        const firstModelChips = initialBindData[0].chips;

        product.chipOptions?.forEach((chipOptionElement) => {
          chipOptionElement.optionValues.forEach((options) => {
            const matchingChip = firstModelChips.find((masterElement) => {
              return masterElement.fmyChipType == chipOptionElement.optionName &&
                masterElement.fmyChipName == options.optionValue;
            })
            if ((chipOptionElement.optionNameEng).toLowerCase() == "color" && options.optionMultiColorFlag == "Y") {
              options.optionCode = options.optionMultiColorCodesList.join(" ");
            }
            options.checked = !!matchingChip;
            options.disable = false;
            options.familyId = product.id;
          })
        })
      })

      return updatedResponse;
    }

    function reverseOtherChipOptions(updatedResponse = []) {
      updatedResponse.forEach(product => {
        (product.chipOptions || []).forEach(chipOption => {
          if ((chipOption.optionNameEng || '').toLowerCase() !== 'color') {
            chipOption.optionValues.reverse();
          }
        });
      });

      return updatedResponse;
    }

    function chipExceptionHandler(data) {
      data.forEach((product) => {
        const keyProductSKU = product.id;
        const isKeyProductChipsEmpty = product.groupedProductList.find(item => {
          return item.id === keyProductSKU && (item.chips || []).length === 0;
        });

        if (isKeyProductChipsEmpty) {
          product.chipOptions = [];
        }
      });

      return data;
    }

    function updateDisabledFlag(configurations) {
      configurations.forEach(config => {
        const checkedSKUs = config.optionValues.find(option => option.checked)?.sku;
        if (checkedSKUs) {
          configurations.forEach(otherConfig => {
            if (otherConfig === config) return;

            otherConfig.optionValues.forEach(option => {
              const isAnySkuInChecked = option.sku.some(sku => checkedSKUs.includes(sku));
              option.disable = !isAnySkuInChecked;
            });
          });
        }
      });

      return configurations;
    }

    function countGreaterThan(num, digits) {
      const thresholds = {
        2: 99,
        3: 999,
        4: 9999,
      };

      const threshold = thresholds[digits];

      return num > threshold ? `${threshold}+` : num;
    }

    const deepClone = function (obj) {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }

      if (Array.isArray(obj)) {  // <-- This checks if it's an array
        return obj.map(item => deepClone(item));  // <-- Clones each array item
      }

      // If not an array, treat as object
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = deepClone(obj[key]);
        }
      }

      return cloned;
    }

    const getTimezoneFromLocalDateStr = function (localDate) {
      var timezone = new Date().toString().match(/\(.*\)/g)[0].match(/[A-Z]/g)?.join('') || "";
      var daysave = false;
      if (['EDT', 'MDT', 'PDT', 'CDT'].indexOf(timezone) > -1) {
        daysave = true;
      }
      if (typeof localDate != 'string') return 'E' + (daysave ? 'D' : 'S') + 'T';

      var offset = /([+-]\d{2}:\d{2})/.exec(localDate)
      if (!offset || !offset[0]) return 'E' + (daysave ? 'D' : 'S') + 'T';

      offset = offset[0];
      switch (offset) {
        case '-04:00':
          return 'EDT';
        case '-05:00':
          return daysave ? 'CDT' : 'EST'
        case '-06:00':
          return daysave ? 'MDT' : 'CST'
        case '-07:00':
          return daysave ? 'PDT' : 'MST'
        case '-08:00':
          return 'PST'
        default:
          return 'E' + (daysave ? 'D' : 'S') + 'T';
      }
    }

    function freeDelivery({ eddMsg }) {
      eddMsg = eddMsg.replace(/estimated delivery/i, 'Estimated Delivery:');

      return `
      <div class="pd21-product-card__delivery">
        <svg class="icon">
          <use xlink:href="#shipping-regular" href="#shipping-regular"></use>
        </svg>
        <p class="pd21-product-card__delivery-text">
          <span class="pd21-product-card__delivery-date">${(is_VD_Page || categoryUtils.isHEPage() || isAudioPage) && !categoryUtils.isMemoryStoragePage() ? "Free Delivery" : ""} ${eddMsg}</span>
        </p>
      </div>
      `;
    }

    function generateEddTemplate(deliveryInfo) {
      if (!deliveryInfo || !deliveryInfo.eddMsg) return '';

      let new_edd_msg = "";
      let new_is_ndd = false;
      let new_timezone = "";
      
      if (
        showEddFilter &&
        Object.keys(deliveryInfo).length > 0
      ) {
        new_edd_msg = deliveryInfo.eddMsg;
        new_is_ndd = deliveryInfo.isNDD;
        new_timezone = deliveryInfo.timezone;
      }

      if (showEddFilter) {
        if (!new_is_ndd) {
          return freeDelivery({ eddMsg: new_edd_msg });
        } else {
          return `
          <div class="pd21-product-card__delivery pd21-product-card__delivery--ndd">
            <svg class="icon">
              <use xlink:href="#shipping-regular" href="#shipping-regular"></use>
            </svg>
            <p class="pd21-product-card__delivery-text">
              <span class="pd21-product-card__delivery-date">Eligible for <b>next-day delivery</b> Order by 3PM ${new_timezone || 'EST'} to qualify.</span>
            </p>
          </div>
          `;
        }
      } else {
        return '';
      }
    }

    function hiddenScroll() {
      if (scrollFlag === true) return;

      scrollFlag = true;
      currentPos = window.scrollY || document.documentElement.scrollTop;

      const body = document.querySelector('body');
      const fixedPos = currentPos > 0 ? `-${currentPos}px` : 0;

      body.style.setProperty('position', 'fixed', 'important');
      body.style.width = '100%';
      body.style.top = fixedPos;
    }

    function visibleScroll() {
      if (scrollFlag !== true) return;

      scrollFlag = false;

      const body = document.querySelector('body');
      body.style.removeProperty('position')
      body.style.width = '';
      body.style.top = '';

      window.scrollTo(0, currentPos);
    }

    function clearEddOnProductCards() {
      const modelCodes = $('.pd21-product-card__delivery-wrap[data-modelcode]')
        .map(function () {
          return $(this).attr('data-modelcode');
        })
        .get()
        .filter(Boolean);

      modelCodes.forEach(modelCode => {
        $(`.pd21-product-card__delivery-wrap[data-modelcode="${modelCode}"]`).empty();
      });

      window.sg.components.Pd21ProductCard.alignCardHeights();
    }

    function normalizeDeliveryData(deliveryData) {
      const deliveryInfo = {};

      if (!Array.isArray(deliveryData)) {
        return deliveryInfo;
      }

      deliveryData.forEach(item => {
        const { product, formattedAvailableDate, availableDate, deliveryName, pickupStore } = item;

        if (!product) return;

        // Check for "NEXT DAY DELIVERY" or "NEXT-DAY DELIVERY" in deliveryName array
        const isNDD = deliveryName?.some(delivery => (delivery.name?.toLowerCase() === "next day delivery" || delivery.name?.toLowerCase() === "next-day delivery") && delivery.availableDate?.trim());

        let timezone = "";

        if (availableDate) {
          const date = new Date(availableDate);

          // Get the timezone offset in minutes (local - UTC)
          const offsetMinutes = -date.getTimezoneOffset();
          const sign = offsetMinutes >= 0 ? '+' : '-';
          const absMinutes = Math.abs(offsetMinutes);
          const hh = String(Math.floor(absMinutes / 60)).padStart(2, '0');
          const mm = String(absMinutes % 60).padStart(2, '0');

          // Format like "2025-11-21T00:00:00-05:00"
          const isoWithOffset = date.toISOString().slice(0, 19) + sign + hh + ':' + mm;

          timezone = getTimezoneFromLocalDateStr(isoWithOffset);
        }

        deliveryInfo[product] = {
          eddMsg: formattedAvailableDate || '',
          isNDD: isNDD,
          deliveryOptions: deliveryName || [],
          pickupStore: pickupStore,
          timezone: timezone,
          rawData: item
        };
      });

      return deliveryInfo;
    }

    function getPromoCardsCount() {
      const cards = $('#contentsCardWrap')
        .find('.pd21-product-card__item.pd21-product-card__banner');

      return cards.length || 0;
    }

    function generateRandomID() {
      const i = window.crypto || window.msCrypto;
      return ([10000000] + -1000 + -4000 + -8000 + -100000000000).replace(/[018]/g, function (j) {
        return (j ^ i.getRandomValues(new Uint8Array(1))[0] & 15 >> j / 4).toString(16)
      })
    }

    function generateWtbUrl(consumerUrl, skuModelCode) {
      if (!consumerUrl || !skuModelCode) {
        return "";
      }

      // Normalize inputs
      const sku = skuModelCode.trim().toLowerCase();
      const trimmed = consumerUrl.replace(/\/+$/, "");


      let wtbUrl;
      if (trimmed.includes("/buy/")) {
        // Replace first occurrence of "/buy/" with "/where-to-buy/"
        wtbUrl = trimmed.replace("/buy/", "/where-to-buy/");
      } else {
        // Insert "/where-to-buy" before the last path segment
        const lastSlash = trimmed.lastIndexOf("/");
        if (lastSlash === -1) {
          // fallback: cannot find a path separator — treat whole as segment
          wtbUrl = `/where-to-buy/${trimmed}`;
        } else {
          wtbUrl = trimmed.slice(0, lastSlash) + "/where-to-buy" + trimmed.slice(lastSlash);
        }
      }

      // Ensure there's exactly one slash before the appended SKU
      if (!wtbUrl.endsWith("/")) {
        wtbUrl += "/";
      }
      wtbUrl += sku;

      return wtbUrl;
    }

    async function reviewRatingLayer(modelCode, $optionInputEl) {
      try {
        const data = await window.sg.components.Pd21Modules.ApiService?.fetchReviewsRatings(modelCode, $optionInputEl);

        let reviewCount = 0;
        if (data != null && data.TotalResults != null) {
          reviewCount = data.TotalResults;
        }
        let reviewRatingItem = "";
        if (reviewCount !== 0 && reviewCount !== "0" && data.Results && data.Results.length > 0 && data.Results[0].ReviewStatistics && data.Results[0].ReviewStatistics.SecondaryRatingsAverages) {
          for (let i = 0; i < data.Results[0].ReviewStatistics.SecondaryRatingsAveragesOrder.length; i++) {
            const secondaryRatingsAveragesText = data.Results[0].ReviewStatistics.SecondaryRatingsAveragesOrder[i];
            const secondaryRatingsAveragesData = data.Results[0].ReviewStatistics.SecondaryRatingsAverages[secondaryRatingsAveragesText];
            const id = secondaryRatingsAveragesData.id;
            const averageRating = secondaryRatingsAveragesData.AverageRating;
            const minLabel = isNotNull(secondaryRatingsAveragesData.Label) ? secondaryRatingsAveragesData.Label : secondaryRatingsAveragesData.MinLabel;

            let ratings = averageRating;
            if (fnIsNull(ratings)) {
              ratings = 0;
            }

            // rating
            const tmpCount = Math.pow(10, 1);
            ratings = Math.round(ratings * tmpCount) / tmpCount;
            if (String(ratings).length == 1) {
              ratings = ratings + ".0";
            }
            const ratingValue = Number(parseFloat(ratings).toFixed(1));
            const fullStarCnt = Number(parseInt(ratings));
            const cutStarWidthStyleNum = Number((ratingValue - fullStarCnt) * 100);
            let itemrating = "";
            for (let j = 0; j < 5; j++) {
              const width = j < fullStarCnt ? 100 : (j === fullStarCnt ? cutStarWidthStyleNum : 0);
              itemrating += '<span class="rating__star-item"><span class="rating__star-empty"></span><span class="rating__star-filled" style="width: ' + width + '%;"></span></span>';
            }
            reviewRatingItem += `<div class="pd21-tooltip__rating-item">
                                <p class="pd21-tooltip__rating-text">${minLabel}</p>
                                <span class="rating">
                                  <span class="rating__inner">
                                    <span class="rating__star-list">
                                      ${itemrating}
                                    </span>
                                    <strong class="rating__point"><span class="hidden"> : </span><span>${ratings}</span></strong>
                                  </span>
                                </span>
                              </div>`;
          }
        }

        $optionInputEl.parent().find(".pd21-tooltip__rating-list").html(reviewRatingItem);
      } catch (err) {
        console.log("Error in reviewRatingLayer");
      }
    }

    return {
      domainName: domainName,
      isNotNull: isNotNull,
      hiddenScroll: hiddenScroll,
      visibleScroll: visibleScroll,
      escapeHtml: escapeHtml,
      truncateText: truncateText,
      deleteCookie: deleteCookie,
      generateCheckboxId: generateCheckboxId,
      chipExceptionHandler: chipExceptionHandler,
      chipKeyProvider: chipKeyProvider,
      reverseOtherChipOptions: reverseOtherChipOptions,
      updateDisabledFlag: updateDisabledFlag,
      countGreaterThan: countGreaterThan,
      getCurrentDevice: getCurrentDevice,
      deepClone: deepClone,
      getTimezoneFromLocalDateStr: getTimezoneFromLocalDateStr,
      normalizeDeliveryData: normalizeDeliveryData,
      generateEddTemplate: generateEddTemplate,
      clearEddOnProductCards: clearEddOnProductCards,
      getPromoCardsCount: getPromoCardsCount,
      generateRandomID: generateRandomID,
      generateWtbUrl: generateWtbUrl,
      reviewRatingLayer: reviewRatingLayer,
    };
  })($);

  // Attach to pd21Modules
  pd21Modules.Utils = Utils;

})(window.jQuery);
(function () {
  'use strict';

  const pd21Modules = window.sg.components.Pd21Modules;
  const categoryUtils = pd21Modules.CategoryUtils;
  const utils = pd21Modules.Utils;
  
  let promoCardsCount = utils.getPromoCardsCount();
  const is_DA_Page = categoryUtils.isHAPage();

  const itemsPerPage = is_DA_Page ? 16 : 24;
  const rCount = is_DA_Page ? itemsPerPage - (Math.min(2, promoCardsCount))  :  itemsPerPage - promoCardsCount;

  const showEddFilter = (categoryUtils.isHAPage() || categoryUtils.isMonitorPage() || categoryUtils.isHEPage() || categoryUtils.isMemoryStoragePage() || categoryUtils.isBundlePage() || categoryUtils.isAudioPage()) && !categoryUtils.isVacuumsPage();

  const state = {
    isLoading: false,
    isMobile: utils.getCurrentDevice() === "mobile",
    pfData: null,
    isFirstRender: true,
    preventAutoScroll: false,
    appliedFiltersInSequence: [], // to maintain the order in the UI
    predefinedFilters: [],
    dynamicFilters: [],
    selectedSortOption: { name: "Recommended", code: "recommended" },
    queryParamFilters: [],
    filtersPayload: [],
    startIndex: 0,
    initialRequestCount: rCount,
    requestCount: rCount,
    searchTotalCount: 0,
    lastOpenedDropdown: "",
    showEddFilter: showEddFilter,
    isEddDropdownOpen: false,
    tempSelectedMobFilters: [],
    zipCode: "",
    fastShipping: "",
    inStorePickup: "",
    nextdayShipping: "",
    compareSelectedItems: [],
    productListData: [],
    chipBinderData: [],
    deliveryInfo: {},
    sellerInfo: {},
    sessionID: "",
    pickContentUse: false,
    bundleMapping: {},
    loadedProducts: [],
    isBundlePage: $("#pfCategoryGroupName").val() === "Package" ? true : false,
    itemsPerPage: itemsPerPage,
    renderedMarketingCardsCount: 0,
  };
  // Attach to pd21Modules
  pd21Modules.State = state;
})();
(function ($) {
  'use strict';

  const isEppPage = $("input#eppFlag").val() === 'Y';
  const categoryCode = $("#pfCategoryTypeCode").val();
  const categorySubTypeCode = $("#pfCategorySubTypeCode").val();
  const categorySubSubTypeCode = $("#pfCategorySubSubTypeCode").val();
  const sribPFDomain = $("#sribPFDomain").val();
  const sribPFClientName = $("#sribPFClientName").val();
  const sribPFStoreID = isEppPage ? $("#companyCode").val() : $("#sribPFStoreID").val();
  const hybrisAPIDomain = $("#hybrisAPIDomain").val();
  const globalSearchAPIDomain = $("#globalSearchAPIDomain").val();
  const globalBridgeAPIDomain = $("#globalBridgeAPIDomain").val();
  const apiStageInfo = $("#apiStageInfo").val() || 'front';

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;
  const utils = pd21Modules.Utils;

  const getSafeString = (str) => {
    if (!str) return null;
    if (typeof str == "undefined") return null;
    if (typeof str != "string") return null;
    if (str.trim().length == 0) return null;
    if (str.trim().toLowerCase() == "none") return null;
    return str.trim();
  }

  const ApiService = (function ($) {
    const paginationDefaultOpt = { startIndex: 0, requestCount: state.requestCount };

    let filterAbortController = null;

    const fetchData = function (filters = [], sort = "", paginationOpt = paginationDefaultOpt) {
      // Abort any previous filter request
      if (filterAbortController) {
        filterAbortController.abort();
      }

      // Create new abort controller
      filterAbortController = new AbortController();
      
      let url = sribPFDomain + "/estoresearch-api/v1/scom/us/pf_search";

      if(window.location.href.indexOf('p6-qaweb-sa') > -1) {
        url = "https://p6-qaweb-sa.samsung.com/estoresearch-api/v1/scom/us-secure/pf_search";
      }

      const { startIndex, requestCount } = paginationOpt;
      const payload = {
        clientCode: "b2c",
        clientName: sribPFClientName,
        firstSearchYN: true,
        countryCode: siteCode,
        storeID: sribPFStoreID,
        startIndex: startIndex,
        requestCount: requestCount,
        category_code: categoryCode,
      };

      const taxonomyCode = getSafeString(categorySubTypeCode);
      if (taxonomyCode) {
        payload["taxonomy_code"] = taxonomyCode;
      };

      const ial4Code = getSafeString(categorySubSubTypeCode);
      if (ial4Code) {
        payload["ial4_code"] = ial4Code;
      };

      /****   Temp hardcoded category_code/taxonomy_code   ***/
      // All Smartphones
      // payload["category_code"] = "n0002101";

      // Galaxy S
      // payload["category_code"] = "n0002101";
      // payload["taxonomy_code"] = "n0002110";

      // Galaxy Z
      // payload["category_code"] = "n0002101";
      // payload["taxonomy_code"] = "n0003062";

      // All Refs
      // payload["category_code"] = "n0002401";

      // All TVs
      // payload["category_code"] = "n0002201";

      // All Computers
      // payload["category_code"] = "n0003068";

      // All Monitors
      // payload["category_code"] = "n0002505";

      payload["filters"] = filters;

      if (sort) {
        payload["sort"] = sort;
      }

      state.isLoading = true;

      // Process payload: stringify complex values
      const processedPayload = Object.entries(payload).reduce((acc, [key, value]) => {
        acc[key] = (Array.isArray(value) || typeof value === 'object') && value !== null
          ? JSON.stringify(value)
          : value;
        return acc;
      }, {});

      return new Promise(function (resolve, reject) {
        const ajaxRequest = $.ajax({
          url: url,
          method: 'POST',
          contentType: 'application/x-www-form-urlencoded',
          data: $.param(processedPayload),
          success: function (response, textStatus, xhr) {
            if (xhr.status === 200) {
              resolve(response);
              searchMetricsAPI(response.metricsParam);
            } else {
              const error = new Error(`Unexpected status: ${xhr.status}`);
              error.status = xhr.status;
              reject(error);
            }

            state.isLoading = false;
            filterAbortController = null;
          },
          error: function (xhr) {
            const error = new Error(`Unexpected status: ${xhr.status}`);
            error.status = xhr.status;
            reject(error);

            state.isLoading = false;
            filterAbortController = null;
          }
        });

        if (filterAbortController.signal) {
          filterAbortController.signal.addEventListener('abort', function () {
            ajaxRequest.abort();
            const abortError = new Error('Request aborted');
            abortError.name = 'AbortError';
            reject(abortError);
            state.isLoading = false;
          });
        }
      });
    };

    async function clickFeedbackAPI(feedbackParam) {
      if (!feedbackParam) return;
      
      // ui
      feedbackParam = feedbackParam.replace(/(ui=)[^&]+/, `$1${utils.generateRandomID()}`);

      // si
      feedbackParam = feedbackParam.replace(/(si=)[^&]+/, `$1${state.sessionID}`);

      // ff
      let ff = window.navigator.userAgent.match(/(Windows\sNT|iOS|iPhone\sOS|Android)\s([\d_]+)/);
      ff = ff ? ff[1].split(' ')[0].toLowerCase() : "";
      feedbackParam = feedbackParam.replace(/(ff=)[^&]+/, `$1${ff}`);

      $.ajax({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        type: "POST",
        url: sribPFDomain + '/estoresearch-api/v1/scom/us/pf_feedback/click',
        data: $.param({
          feedbackParam: feedbackParam,
          actionType: "click"
        })
      });
    }

    async function searchMetricsAPI(metricsParam) {
      if (!metricsParam) return;

      // ui
      metricsParam = metricsParam.replace(/(ui=)[^&]+/, `$1${utils.generateRandomID()}`);

      // si
      metricsParam = metricsParam.replace(/(si=)[^&]+/, `$1${state.sessionID}`);

      // ff
      let ff = window.navigator.userAgent.match(/(Windows\sNT|iOS|iPhone\sOS|Android)\s([\d_]+)/);
      ff = ff ? ff[1].split(' ')[0].toLowerCase() : "";
      metricsParam = metricsParam.replace(/(ff=)[^&]+/, `$1${ff}`);

      $.ajax({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        type: "POST",
        url: sribPFDomain + '/estoresearch-api/v1/scom/us/pf_metrics/search',
        data: $.param({
          metricsParam: metricsParam
        })
      });
    }

    const getSpecsData = function(SKU) {
      const encodedSKU = encodeURIComponent(SKU);
      
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: `${globalSearchAPIDomain}/v6/${apiStageInfo}/b2c/product/spec/compare?siteCode=${siteCode}&modelList=${encodedSKU}`,
          method: 'GET',
          success: function (response, textStatus, xhr) {
            if (xhr.status === 200) {
              resolve(response); // Return data directly
            } else {
              const error = new Error(`Unexpected status: ${xhr.status}`);
              error.status = xhr.status;
              reject(error);
            }
          },
          error: function (xhr) {
            const error = new Error(`Unexpected status: ${xhr.status}`);
            error.status = xhr.status;
            reject(error);
          }
        });
      });
    };

    const fetchLocation = function (latitude, longitude) {
      const payload = {
        latitude: latitude,
        longitude: longitude
      };

      state.isLoading = true;

      return new Promise(function (resolve, reject) {
        $.ajax({
          url: globalBridgeAPIDomain + '/us/gapi/v1/bridge/postal-code',
          method: 'POST',
          timeout: 0,
          headers: {
            "Content-Type": "application/json",
          },
          contentType: 'application/json',
          data: JSON.stringify(payload),
          success: function (response, textStatus, xhr) {
            if (xhr.status === 200) {
              resolve(response);
            } else {
              const error = new Error(`Unexpected status: ${xhr.status}`);
              error.status = xhr.status;
              reject(error);
            }
            state.isLoading = false;
          },
          error: function (xhr) {
            const error = new Error(`Unexpected status: ${xhr.status}`);
            error.status = xhr.status;
            reject(error);
            state.isLoading = false;
          }
        });
      });
    };

    const validateZipcode = function (zipCode) {
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: `${hybrisAPIDomain}/tokocommercewebservices/v2/${sribPFStoreID}/users/current/addresses/postcode/${zipCode}?lang=en_US&curr=USD`,
          method: 'GET',
          success: function (response, textStatus, xhr) {
            if (xhr.status === 200) {
              resolve(response);
            } else {
              const error = new Error(`Unexpected status: ${xhr.status}`);
              error.status = xhr.status;
              reject(error);
            }
          },
          error: function (xhr) {
            const error = new Error(`Unexpected status: ${xhr.status}`);
            error.status = xhr.status;
            reject(error);
          }
        });
      });
    };

    const updateCartZipcode = function (zipCode) {
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: `${hybrisAPIDomain}/tokocommercewebservices/v2/${sribPFStoreID}/users/current/carts/current/updatePostCode?postCode=${zipCode}&lang=en_US&curr=USD`,
          method: 'POST',
          xhrFields: {
            withCredentials: true
          },
          success: function (response, textStatus, xhr) {
            if (xhr.status === 200) {
              resolve(response);
            } else {
              const error = new Error(`Unexpected status: ${xhr.status}`);
              error.status = xhr.status;
              reject(error);
            }
          },
          error: function (xhr) {
            const error = new Error(`Unexpected status: ${xhr.status}`);
            error.status = xhr.status;
            reject(error);
          }
        });
      });
    };

    const getEDD = function (productCodes) {
      state.isLoading = true;

      const $inputValidateEl = $(".text-field-v2__validate");
      $inputValidateEl.removeClass("active error").addClass("success");

	  const uriSiteCode = isEppPage ? sribPFStoreID : 'us';
      $(".text-field-v2__zipcode").val(state.zipCode);

      return new Promise(function (resolve, reject) {
        $.ajax({
          url: `${hybrisAPIDomain}/tokocommercewebservices/v2/${uriSiteCode}/products/getEddForProductsAndDeliveryModes?productCodes=${productCodes}&postCode=${state.zipCode}`,
          method: 'GET',
          timeout: 0,
          success: function (response, textStatus, xhr) {
            if (xhr.status === 200) {
              resolve(response);
            } else {
              const error = new Error(`Unexpected status: ${xhr.status}`);
              error.status = xhr.status;
              reject(error);
              $inputValidateEl.removeClass("success active").addClass("error");
            }
            state.isLoading = false;
          },
          error: function (xhr, textStatus) {
            if (xhr.status === 0 || textStatus === "abort") {
              state.isLoading = false;
              return;
            }

            const error = new Error(`Unexpected status: ${xhr.status}`);
            error.status = xhr.status;
            reject(error);
            $inputValidateEl.removeClass("success active").addClass("error");
            state.isLoading = false;
          }
        });
      });
    };

    const fetchReviewsRatings = function (modelCode, $optionInputEl) {
      const $usBvApiUrl = $("#usBVAPIURL").val();
      const $usPassKey = $("#usBVAPIKey").val();

      return new Promise(function (resolve, reject) {
        $.ajax({
          type: 'get',
          cache: false,
          url: $usBvApiUrl + "/data/products.json?ApiVersion=5.4&PassKey=" + $usPassKey + "&Filter=id:" + modelCode + "&stats=Reviews",
          dataType: 'jsonp',
          jsonp: 'callback',
          contentType: 'application/json',
          success: function (response, textStatus, xhr) {
            if (xhr.status === 200) {
              resolve(response);
            } else {
              const error = new Error(`Unexpected status: ${xhr.status}`);
              error.status = xhr.status;
              reject(error);
            }
          },
          error: function (xhr, status, err) {
            reject(err);
          },
          complete: function (data) {

          }
        });
      })
    }

    return {
      fetchData: fetchData,
      getSpecsData: getSpecsData,
      fetchLocation: fetchLocation,
      getEDD: getEDD,
      clickFeedbackAPI: clickFeedbackAPI,
      validateZipcode: validateZipcode,
      updateCartZipcode: updateCartZipcode,
      fetchReviewsRatings: fetchReviewsRatings,
    };
  })($);

  // Attach to pd21Modules
  pd21Modules.ApiService = ApiService;

})(window.jQuery);
(function () {

  const pd21Modules = window.sg.components.Pd21Modules;
  const utils = pd21Modules.Utils;
  const apis = pd21Modules.ApiService;
  const categoryUtils = pd21Modules.CategoryUtils;
  const state = pd21Modules.State;

  const DOMAIN_NAME = utils.domainName;
	const pageTrack = $("#pfPageTrack").val();
  const isEpp =  $('#eppFlag').val() === 'Y';
  let specsData = {};

  const buildQuickViewProductInfoArea = async (prodObj) => {

    let productData = utils.deepClone(prodObj);
    const productChipsData = utils.deepClone(prodObj);

    const fetchSpecsDetails = async (productId) => {
      try {
        if(!productId) return;
        const { response } = await apis.getSpecsData(productId);
        if (response?.statusCode == 200) {
          specsData = response.resultData;
        } else {
          specsData = {};
          console.error(response?.statusMessage);
        }
      } catch (error) {
        specsData = {};
        console.error(error);
      }
    }
    
    const escapeAttr = function (text) {
      let newText = text;
      if (newText) {
        newText = newText
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "\\&quot;")
          .replace(/'/g, "&#039;");
      }
      return newText;
    };


    function quickViewMarkup(productData) {

      const is_HA_Page = categoryUtils.isHAPage();
      const is_DA_Page = categoryUtils.isHEPage() || categoryUtils.isHAPage();
      const is_MX_page = categoryUtils.isMobilePage();
      const isAccessoriesPage = categoryUtils.isAccessoriesPage();
      const isBundlePage = categoryUtils.isBundlePage();

      const productBadgeArea = () => {

        let badgeClass, badgeText;
        if ((productData?.badgeDetails) && (productData?.badgeDetails?.iconTitle)) {

          badgeText = productData?.badgeDetails?.iconTitle;
          const normalizedText = badgeText.toLowerCase();

          badgeClass = " badge-icon--bg-color-teal";
          if (normalizedText === "new") badgeClass = " badge-icon--bg-color-blue";
          else if (normalizedText === "hot") badgeClass = " badge-icon--bg-color-red";
          else if (normalizedText === "best-seller" || normalizedText === "bestseller")
            badgeClass = " badge-icon--bg-color-orange";

        }

        const content = `
          <div class="pd21-quick-view__badge">
            <span class="badge-icon badge-icon--label-v2 ${badgeClass}"> ${badgeText ? utils.truncateText(badgeText, 18) : ""} </span>
          </div>
        `
        return content;
      }

      const productImageArea = () => {

        const galleryImage = productData?.galleryImage || [];
        let imagesHtml = '', indicatorHtml = ''
        galleryImage.forEach((imageUrl, idx) => {
          imagesHtml += `
               <div 
                  class="pd21-quick-view__gallery-item swiper-slide swiper-slide-next"
                  aria-label=""
                  role="listitem"
                  data-tagging='{
				            "an-tr":"pd21_product finder / cards-${pageTrack}-index-indication",
				            "an-ca":"indication",
				            "an-ac":"carousel",
				            "an-la":"carousel:index:${(idx + 1)}"
				          }'
                  aria-describedby="swiper1${idx}" 
                  aria-hidden="true"
                >
                  <div class="image image--main-loaded">
                      <img class="image__preview image--loaded image--hide" alt="alt text" role="img"
                          data-comp-name="image" src="${imageUrl}" aria-hidden="true">
                      <img class="image__main image--loaded" alt="alt text" role="img" data-comp-name="image"
                          src="${imageUrl}" style="">
                  </div>
              </div>
            `

          indicatorHtml += `
              <button
                class="indicator__item swiper-pagination-bullet"
                role="tab" data-type-clickid="${idx}"
                id="swiper1${idx}"
                data-type-slide-index="${idx}"
                aria-selected="false"
              >
                  <span class="indicator__dot-wrap">
                    <span class="indicator__dot">
                      <span class="indicator__dot-inner"></span>
                    </span>
                    <span class="hidden">null</span>
                  </span>
              </button>
            `
        });

        const content = `
                      <div 
                        class="pd21-quick-view__gallery swiper-container basic-swiper swiper-slide--beginning swiper-container-initialized swiper-container-horizontal"
                        data-swiper-option="{
                          &quot;slidesPerView&quot;: &quot;auto&quot;,
                          &quot;centeredSlides&quot;: true,
                          &quot;pagination&quot;: true,
                          &quot;offTxtAccesibility&quot;: true,
                          &quot;componentEl&quot;: &quot;.pd21-quick-view&quot;
                        }"
                        an-tr="pd21_product finder / cards-${pageTrack}-gallery module-gallery"
                        an-ca="gallery"
                        an-ac="product gallery"
                        an-la="gallery:image"
                      >
                            <div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px);">
                               ${imagesHtml}
                            </div>
                        </div>
            
                        <div class="indicator dot-indicator" data-indicator-data="{
                              &quot;type&quot;: &quot;dot-indicator&quot;
                            }" data-dot-scrollable="" data-comp-name="indicator">
                            <div class="indicator-wrap">
                                <div class="indicator__list-wrap dot-more">
                                    <div class="indicator__list swiper-pagination-clickable swiper-pagination-bullets"
                                        role="tablist">
                                        ${indicatorHtml}
                                      </div>
                                </div>
                            </div>
                        </div>
            
        `
        return content;
      }

      const productTitleArea = () => {

        let productName = "";
        if (is_HA_Page || isBundlePage) {
          if (
            productData.productShortTitle &&
            productData.productShortTitle !== null &&
            productData.productShortTitle !== undefined &&
            productData.productShortTitle.length > 0
          ) {
            productName = productData.productShortTitle;
          } else {
            productName = productData.name;
          }

        } else if (is_MX_page) {
          if (productData.familyMktName) {
            productName = productData.familyMktName;
          } else if (productData.productDisplayName) {
            productName = productData.productDisplayName;
          } else {
            productName = productData.name;
          }

        } else {
          if (productData.productShortTitle) {
            productName = productData.productShortTitle;
          } else if (productData.productDisplayName) {
            productName = productData.productDisplayName;
          } else {
            productName = productData.name;
          }
        }

        const productFeatureTitle = productData.productFeatureTitle ? productData.productFeatureTitle : '';
        const vdSubTitle = productData.productFeatureTitle ? productData.productFeatureTitle : '';

        const content = `
          <p class="pd21-quick-view__name">
            ${productName}
          </p>
          ${productFeatureTitle && (is_HA_Page || isBundlePage) ?
            `<p class="pd21-quick-view__feature-title">
                ${productFeatureTitle}
              </p>
            `: ""}
            ${!is_HA_Page && !is_MX_page && vdSubTitle ?
            `<p class="pd21-quick-view__feature-title">
                ${vdSubTitle}
              </p>
            `: ""}
          <p class="pd21-quick-view__sku">${utils.truncateText(productData?.modelCode, 45)}</p>   
        `

        return content;
      }

      const productRatingsArea = () => {

        if (productData.reviewRating === 0) return "";

        const liteMode = state.isMobile;
        let starHtml = ''
        rating = Number(productData.reviewRating);
        const starCounts = liteMode ? 1 : 5;
        [...new Array(starCounts)].forEach((val, idx) => {
          const diff = rating - idx;
          const percentage = diff > 1 ? 1 : (diff > 0 ? diff : 0);
          starHtml += `<span id="${idx}" class="rating__star-item"><span class="rating__star-empty"></span><span class="rating__star-filled" style="width: ${percentage * 100}%;"></span></span>`
        });

        const content = `
              <a 
                href="${productData.linkUrlReview}"
                class="pd21-quick-view__rating js-click-feedback"
                data-feedback-param="${utils.escapeHtml(productData.feedbackParam)}"
                an-tr="pd21_product finder / cards-${pageTrack}-review-review1"
                an-ca="review"
                an-ac="quick view popup"
                an-la="read review"
                data-modelcode=${productData.modelCode}
                data-modelname=${productData.modelName}
              >
                  <!-- /* 전체 Empty: .rating--empty 추가 */ -->
                  <span class="rating">
                      <!-- (2021.08.23 수정) <span class="hidden">Rating</span> 삭제 -->
                      <!--  <span class="hidden">Rating</span>-->
                      <span class="rating__inner">
                          <span class="rating__star-list">
                            ${starHtml}
                          </span>
                          <strong class="rating__point"><span class="hidden">Product Ratings :
                              </span><span>${Number(productData.reviewRating).toFixed(1)}</span></strong>
                          <em class="rating__review-count">(<span class="hidden">Number of Ratings
                                  :</span><span>${utils.countGreaterThan(productData.numberOfReviews, 4)}</span>)</em>
                      </span>
                  </span>
              </a>
        `
        return content;
      }

      const productHighlightsArea = () => {

        if (!prodObj?.keyFeatures || !prodObj?.keyFeatures?.length) return "";

        const highlightsList = prodObj?.keyFeatures
          ?.map((highlight => (`<p class="pd21-quick-view__highlights-text">${utils.truncateText(highlight, 45)}</p>`)))
          .join("");

        return `<div class="pd21-quick-view__highlights">${highlightsList}</div>`
      }

      const productPricingArea = () => {

        const saveFlag = productData.sale_price_currency && productData.sale_price_currency != productData.msrp_price_currency;
        const currentPrice = productData.sale_price_currency ? productData.sale_price_currency : "";
        const savePrice = Number(productData.msrp_price - productData.sale_price).toFixed(2);

        if(!currentPrice) return "";
        return `
              <div class="price-ux__wrap price-ux__wrap--ux-v2">
                <div class="price-ux__price-current"><strong>${utils.truncateText(currentPrice, 23)}</strong></div>
                ${saveFlag ? `
                  <p class="price-ux__price-save">
                    <span class="hidden">Save Price: </span>
                    <em>Save $${utils.truncateText(savePrice, 18)}</em>
                  </p>`
                 : ""
                }
              </div>
        `
      }

      const productSellerInfoArea = () => {

        const sellerInfo = productData?.sellerInfo;
        if (!isAccessoriesPage || sellerInfo?.UseYN !== 'Y' || !sellerInfo?.Seller) return '';

        return `<div class="pd21-quick-view__seller">
                  <p>
                    ${utils.truncateText("Seller:", 12)} 
                    <span>${utils.truncateText(sellerInfo.Seller, 15)}</span>
                  </p>
                </div>`;
      }

      const productColorFamilyOptnsArea = () => {

        const colorChipData = productChipsData.chipOptions?.filter((el) => el.optionNameEng?.toLowerCase() == "color");
        const chosenColorLabel = colorChipData[0]?.optionValues.filter((el) => el.checked);

        const colorChipOptionValues = colorChipData[0]?.optionValues || [];
        let colorTooltipText = ''

        if (!colorChipOptionValues.length) return "";
        const chips = colorChipOptionValues
          .map((optn) => {
            colorTooltipText += `${optn.optionValue}, `

            return `
                <div 
                    class="${optn.checked ? "is-checked" : ""} ${optn.disable ? "is-disabled" : ""} option-selector-v2__swiper-slide js-pfv2-qv-product-fmychip" 
                    role="listitem"
                    data-modeli="${productChipsData?.id}" 
                    data-chip-code="${optn.optionCode}" 
                    data-chip-value="${optn.optionValue}">
                    <button
                      type="button"
                      class="option-selector-v2__color"
                      an-tr="pd21_product finder / cards-${pageTrack}-option-option_click"
                      an-ca="option click"
                      an-ac="quick view popup"
                      an-la="${colorChipData[0]?.optionName}:${optn.optionValue}"
                      data-modelcode=${productData.modelCode}
                      data-modelname=${productData.modelName}
                    >
                        <span class="option-selector-v2__color-code"
                            style="background-color: ${optn.optionCode}">
                            <span class="hidden">${optn.optionValue}</span>
                        </span>
                    </button>
                </div>
              `
          })
          .join("");

        colorTooltipText = colorTooltipText.replace(/,\s*$/, "");
        const content = `
              <p class="pd21-quick-view__sub-title">Select a color</p>
              <div class="option-selector-v2__color-name">
                  <span>${utils.truncateText(chosenColorLabel[0]?.optionValue || "", 19)}</span>
                  <div class="pd21-quick-view__options-tooltip">${colorTooltipText}</div>
              </div>
              <div class="option-selector-v2__wrap option-selector-v2__wrap--color-chip"
                  data-global-text="{ &quot;selected&quot; : &quot;selected&quot; }">
                  <div class="option-selector-v2__swiper option-selector-v2__swiper--min">
                      <div class="option-selector-v2__swiper-container">
                          <div class="option-selector-v2__swiper-wrapper"
                            data-chip-type="${colorChipData[0]?.optionNameEng}"
                            role="list">
                            ${chips}
                          </div>
                      </div>
                  </div>
              </div>
            `
        return content;
      }

      const productOtherFamilyOptnsArea = () => {

        const otherChipData = productChipsData.chipOptions?.filter((el) => el.optionNameEng?.toLowerCase() != "color");

        const optionListBuild = (chip) => {

          const optionValues = chip.optionValues;

          const optionListHtml = optionValues.map((optn) => (`
              <div 
                class="${optn.checked ? "is-checked" : ""} ${optn.disable ? "is-disabled" : ""} option-selector-v2__swiper-slide js-pfv2-qv-product-fmychip" 
                data-modeli="${productChipsData?.id}" 
                data-chip-code="${escapeAttr(optn.optionValue.toLowerCase().replace(/"/ig, ""))}" 
                data-chip-value="${optn.optionValue}">
                  <button
                    type="button"
                    class="option-selector-v2__size"
                    an-tr="pd21_product finder / cards-${pageTrack}-option-option_click"
                    an-ca="option click"
                    an-ac="quick view popup"
                    an-la="${chip?.optionName}:${optn.optionValue}"
                    data-modelcode=${productData.modelCode}
                    data-modelname=${productData.modelName}
                  >
                      <span class="option-selector-v2__size-text">${optn.optionValue}</span>
                      <span class="blind">selected</span>
                  </button>
              </div>
            `))
            .join("");

          return `
            <div class="option-selector-v2__swiper option-selector-v2__swiper--min">
                <!-- (2021.07.07 수정) aria-live="polite" 삭제 -->
                <div class="option-selector-v2__swiper-container">
                    <!-- (2021.07.07 수정) role="list" 추가 -->
                    <div class="option-selector-v2__swiper-wrapper"
                      data-chip-type="${chip?.optionNameEng}"
                      role="list">
                        <!-- (2021.07.07 수정) role="listitem" 추가 -->
                          ${optionListHtml}
                    </div>
                </div>
            </div>
          `
        }

        const otherChipHtml = otherChipData
          .map((chip) => (`
                <p class="pd21-quick-view__sub-title">Select a ${chip.optionName.toLowerCase()}</p>

                <div class="option-selector-v2__wrap option-selector-v2__wrap--capacity"
                    data-global-text="{ &quot;selected&quot; : &quot;selected&quot; }">
                    ${optionListBuild(chip)}
                </div>
              `))
          .join("");

        return otherChipHtml;
      }

      const productSpecArea = () => {
        
        if (!specsData.modelList) return '';

        const { modelList } = specsData;
        const selectedOptions = [];
        let specItems = [];
        if (modelList.length > 0) {
          const specDetail = modelList[0];
          if (utils.isNotNull(specDetail)) {
            const specs = specDetail.specs;
            if (utils.isNotNull(specs)) {
              specItems = specs ?? [];
            }
          }
        }
        let specCnt = 0;
        for (const specItem of specItems) {
          
          if (specCnt == 4) {
            break;
          }
          const attributesName = specItem.attrName;
          const attributesValue = specItem.attrValue;
          const option = `
            <li class="pd21-quick-view__specs-item">
              <p class="pd21-quick-view__specs-title">${attributesName}</p>
              <p class="pd21-quick-view__specs-desc">${attributesValue}</p>
            </li>
					`;
          selectedOptions.push(option);
          specCnt++;

        }

        var optionList = selectedOptions.length > 0 ? `
			      <div class="pd21-quick-view__specs">
              <p class="pd21-quick-view__sub-title">Specs</p>
              <ul class="pd21-quick-view__specs-list">
                ${selectedOptions.join("")}
              </ul>
            </div>
			` : "";

        return optionList;
      }

      const productCtaArea = () => {


        let buyLink = productData.consumerUrl || productData.pdpURL || '';
        let ctaText = '';
        let isNotifyMe = false;

        let wtbUrl = productData.wtbUrl;
        if (!wtbUrl) {
          wtbUrl = utils.generateWtbUrl(productData?.consumerUrl, productData?.modelCode);
        }

        if (productData?.ecomFlag === 'Y') {
          switch (productData?.stockFlag) {
            case 'Y':
            case 'B':
              ctaText = 'Buy';
              break;
            case 'P':
              ctaText = 'Pre-order';
              break;
            case 'R':
              ctaText = 'Reserve now';
              break;
            case 'E':
              ctaText = 'Notify me';
              isNotifyMe = true;
              break;
            case 'N':
              if (isEpp) {
                ctaText = 'Buy';
              } else {
                ctaText = 'Notify me';
                isNotifyMe = true;
              }
              break;
            default:
              if (isEpp) {
                ctaText = 'Buy';
              } else {
                ctaText = 'Buy';
              }
          }
        } else {
          if (isEpp) {
            ctaText = 'Buy';
          } else {
            buyLink = wtbUrl;
            ctaText = 'Where to buy';
          }
        }

        let learnMoreUrl = '';
        if (productData.mlpUrl) {
          learnMoreUrl = productData.mlpUrl;
        } else if (productData.pdpURL) {
          const anchor = is_MX_page ? '' : is_HA_Page ? '#benefits' : '#highlights';
          learnMoreUrl = productData.pdpURL + anchor;
        } else {
          learnMoreUrl = '';
        }

        return `
          <div class="pd21-quick-view__cta">
            <a 
              href="${learnMoreUrl}"
              data-feedback-param="${utils.escapeHtml(productData.feedbackParam)}"
              class="cta cta--outlined cta--black js-click-feedback"
              an-tr="pd21_product finder / cards-${pageTrack}-link to pd-product_click"
              an-ca="product click"
              an-ac="quick view popup"
              an-la="learn more click"
              data-modelcode=${productData.modelCode}
              data-modelname=${productData.modelName}
            >
              Learn more
            </a>
             ${isNotifyMe ? `
            <button
              data-feedback-param="${utils.escapeHtml(productData.feedbackParam)}"
              class="cta cta--contained cta--black js-cta-stock js-click-feedback"
              an-tr="pd21_product finder / cards-${pageTrack}-cta-buy_cta2"
              an-ca="buy cta"
              an-ac="${ctaText}"
              an-la="quick view popup:${ctaText}"
              data-modelcode=${productData.modelCode}
              data-modelname=${productData.modelName}
            >
              ${ctaText}
            </button>
          ` : `
            <a
              href="${buyLink}"
              data-feedback-param="${utils.escapeHtml(productData.feedbackParam)}"
              class="cta cta--contained cta--black cta-addToCart-btn js-click-feedback"
              an-tr="pd21_product finder / cards-${pageTrack}-cta-buy_cta2"
              an-ca="buy cta"
              an-ac="${ctaText}"
              an-la="quick view popup:${ctaText}"
              data-modelcode=${productData.modelCode}
              data-modelname=${productData.modelName}
            >
              ${ctaText}
            </a>
            `}
          </div>
        `
      }

      function quickViewEvent() {
        const $fmyChipEl = $('.js-pfv2-qv-product-fmychip');
        const $colorOptnNameEl = $('.option-selector-v2__color-name');
        const $colorOptnNameE = $('.pd21-quick-view__options-tooltip');

        // Color Names Tooltip logic
        $colorOptnNameEl.each(function () {
          const $parent = $(this);
          const $tooltip = $parent.find('.pd21-quick-view__options-tooltip');

          $parent.on('mouseenter', function () {
            $tooltip.show();
          });

          $parent.on('mouseleave', function () {
            $tooltip.hide();
          });
        });

        $fmyChipEl.on("click", function (e) {


          const $optionInputEl = $(this);
          const $parentEl = $optionInputEl.parent();

          const chipCode = $optionInputEl.data("chip-code");
          const chipValue = $optionInputEl.data("chip-value");
          const modelIdx = $optionInputEl.data("modeli");
          const chipType = $parentEl.data("chip-type");



          setTimeout(async function () {
            if (modelIdx) {

              let updatedResponse = { ...productChipsData };
              updatedResponse.chipOptions.forEach((chipOption) => {
                if ((chipOption.optionNameEng).toLowerCase() == chipType.toLowerCase()) {

                  chipOption.optionValues = chipOption.optionValues.map(
                    (option) => {

                      return {
                        ...option,
                        checked: (chipType.toLowerCase() == 'color' ? (option.optionCode === chipCode && option.optionValue === chipValue) : option.optionValue.toLowerCase().replace(/"/ig, "") == chipCode),
                      }
                    }
                  );
                }
              });

              const otherChipData = productChipsData.chipOptions?.filter(el => {
                const name = el.optionNameEng?.toLowerCase();
                return chipType.toLowerCase() === "color" ? name !== "color" : name === "color";
              });

              const collectedMappers = [];

              const updatedSelectedChip = updatedResponse.chipOptions?.filter((el) => (chipType.toLowerCase() == 'color' ? el.optionNameEng.toLowerCase() == "color" : el.optionNameEng.toLowerCase() !== "color"));

              updatedSelectedChip.forEach((updatedSelectedChipElem) => {
                updatedSelectedChipElem.optionValues.map((option) => {
                  if (option.checked) {
                    collectedMappers.push(option.optionValue);
                  }
                });
              });

              if (chipType.toLowerCase() == 'color') {
                otherChipData.forEach((otherChipDataOption) => {
                  otherChipDataOption.optionValues.map((option) => {
                    if (option.checked) {
                      collectedMappers.push(option.optionValue);
                    }
                  });
                });
              } else {
                otherChipData[0]?.optionValues.map((el) => {
                  if (el.checked) {
                    collectedMappers.push(el.optionValue);
                  }
                });
              }

              const clickedProductIs = productChipsData;

              const matchingParent = clickedProductIs.groupedProductList.find(
                (obj) =>
                  collectedMappers.every((mapper) => {
                    return obj.chips.some((chipElement) => {
                      return chipElement.fmyChipName == mapper;
                    });
                  })
              );

              let updatedDynamicParts = { ...productData };

              if (matchingParent) {
                updatedDynamicParts = matchingParent;
              }

              updatedResponse.chipOptions = utils.updateDisabledFlag(updatedResponse.chipOptions)

              await fetchSpecsDetails(updatedDynamicParts?.id);
              // await fetchSpecsDetails("SM-S721UZKEXAG");
              quickViewMarkup(updatedDynamicParts);
              productData = {...productData, updatedDynamicParts}

            }
          }, 300);

        });

        $('.pd21-quick-view').off('click.feedbackAPI');
        $('.pd21-quick-view').on('click.feedbackAPI', '.js-click-feedback', function (e) {
          const feedbackParam = $(this).data('feedback-param');
          apis.clickFeedbackAPI(feedbackParam);
        });
      }

      const html = `
            <div class="pd21-quick-view__scrollbar scrollbar">
                <div class="scrollbar__wrap">
                    <div class="scrollbar__contents">
                        ${productBadgeArea()}
            
                        ${productImageArea()}
            
                        ${productTitleArea()}
            
                        ${productRatingsArea()}
            
                        ${productHighlightsArea()}
                        
                        ${productPricingArea()}
            
                        ${productSellerInfoArea()}
            
                      <div class="pd21-quick-view__options">
                          <!-- (2021.04.14 수정) .option-selector-v2__color-text 추가 -->
                          <!--/* [D] Color Chips 사용 시 .option-selector-v2__color-text 클래스 추가 (Color Chip을 사용 하지 않을 경우 .option-selector-v2__color-text 클래스 추가하지 말아주세요) */-->
                          <div class="option-selector-v2 option-selector-v2__color-text">
                            <!--/* 초기 생성 : .option-selector-v2__wrap하위 .option-selector-v2__swiper-slide에 .is-checked 가 붙어 있는 경우는 해당 슬라이드가 활성화 됨
                                  .option-selector-v2__wrap를 다시 그리는 경우, 기존 상태를 유지하려면 .option-selector-v2__swiper-wrapper 의 inline style값을
                                  .option-selector-v2__swiper-wrapper의 style에 동일하게 부여한 뒤, window.sg.common.optionSelectorV2.reInit(새로 그린 .option-selector-v2__wrap); 호출
                                  단!!! .option-selector-v2를 감싸는 component가 있고 해당 component를 reInit하는 경우는 위의 함수를 호출 하지 않아도 됨
                            */-->
                              <!--/* Colorchip */-->
                              <!-- (2021.04.14 수정) color name 추가 -->
                              ${productColorFamilyOptnsArea()}
                              <!--/* //Colorchip */-->


                              <!--/* <p class="pd21-quick-view__sub-title">OS</p> */-->
                              <!--/* <p class="pd21-quick-view__sub-desc">Window 11 Home</p> */-->
                              ${productOtherFamilyOptnsArea()}
                          </div>
                      </div>
            
            
            
                      ${productSpecArea()}
            
                    </div>
                </div>
            
                <div class="scrollbar-horizontal__track" style="display: none;">
                    <div class="scrollbar-horizontal__track-content">
                        <div class="scrollbar-horizontal__bar"></div>
                    </div>
                </div>
                <div class="scrollbar-vertical__track">
                    <div class="scrollbar-vertical__track-content">
                        <div class="scrollbar-vertical__bar"
                            style="height: 30.1951px; transform: translate3d(0px, 34.9539px, 0px);"></div>
                    </div>
                </div>
            </div>
            
            
            ${productCtaArea()}
            
            
            
            <button 
              class="pd21-quick-view__close" js-data-action="pd21QuickViewClose"
              an-tr="pd21_product finder / cards-${pageTrack}-quick view pop up close-content_click"
              an-ca="content click"
              an-ac="feature"
              an-la="quick view popup:close"
            >
                <span class="hidden">close</span>
                <svg class="icon" focusable="false">
                    <use xlink:href="#cancel-close-regular" href="#cancel-close-regular"></use>
                </svg>
            </button>
            
      `

      $(".pd21-quick-view__contents").html(html);
      window.sg.components.Pd21ProductFinder.reInitQuickView();
      quickViewEvent();
    }

    await fetchSpecsDetails(prodObj?.id);
    // await fetchSpecsDetails("SM-S721UZKEXAG");
    quickViewMarkup(productData);

  }

  window.sg.components.Pd21ProductCard = {};
  window.sg.components.Pd21ProductCard.buildQuickViewProductInfoArea = buildQuickViewProductInfoArea;

})();

(() => {
  const $q = window.sg.common.$q;
  const utils = window.sg.common.utils;
  const setMobileFocusLoop = window.sg.common.utils.setMobileFocusLoop;
  const removeMobileFocusLoop = window.sg.common.utils.removeMobileFocusLoop;
  const pd21Modules = window.sg.components.Pd21Modules;

  const state = pd21Modules.State;

  const selector = {
    section: '.pd21-confirm-popup',
    close: '.pd21-confirm-popup__close',
    focusEl: 'a:not([style*="display: none"]):not([style*="display:none"]), button:not([style*="display: none"]):not([style*="display:none"]), input',
  };

  class PopupConfirm {
    constructor(el) {
      this.els = {
        el,
        popupConfirmCloseBtn: el.querySelector('.pd21-confirm-popup__close'),
        popupConfirmNoBtn: el.querySelector('.pd21-confirm-popup .pd21-confirm-popup__cta-wrap Button:first-of-type'),
        popupConfirmYesBtn: el.querySelector('.pd21-confirm-popup .pd21-confirm-popup__cta-wrap Button:last-of-type'),
      };
      this.init();
    }

    init() {
      if (PopupConfirm.instances.get(this.els.el)) {
        return;
      }

      PopupConfirm.instances.set(this.els.el, this);

      this.bindEvents();
    }

    bindEvents() {
      this.els.popupConfirmCloseBtn.addEventListener('click', () => {
        this.close();
      });
      this.els.popupConfirmNoBtn.addEventListener('click', () => {
        this.close();
      });
      this.els.popupConfirmYesBtn.addEventListener('click', () => {
        this.close();
      });

      const closeBtn = document.querySelector(`${selector.section} ${selector.close}`);
      closeBtn.removeEventListener('keydown', keydownCloseBtn);
      closeBtn.addEventListener('keydown', keydownCloseBtn);

      const layer = $q(selector.section).find(selector.focusEl).target[0];
      layer.removeEventListener('keydown', keydownLayer);
      layer.addEventListener('keydown', keydownLayer);
    }

    close() {
      const productCardList = $q('.pd13-offers-product-card-list');
      const productFinder = $q('.pd12-product-finder');

      if (productCardList.target.length > 0 || productFinder.target.length > 0) {
        const confirmPop = $q('.pd21-confirm-popup');
        if (confirmPop.attr('data-aria-hidden')) { //call in popup
          confirmPop.attr('aria-hidden', 'true');

          const callLayer = ['.pd-get-stock-alert-popup', '.pd21-compare-popup'];

          callLayer.forEach((layerEl) => {
            if ($q(layerEl).css('display') === 'block') {
              $q(layerEl).removeAttr('data-aria-hidden');
              $q(layerEl).removeAttr('aria-hidden');
            }
          });
        } else {
          removeMobileFocusLoop();
        }
      } else {
        if (document.querySelectorAll('[data-aria-hidden]').length > 0) {
          removeMobileFocusLoop();
        }
      }

      this.els.el.style.display = 'none';
      utilsHide();

      const agent = window.navigator.userAgent;
      const isIphone = agent.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
      const iosVersion = isIphone ? parseFloat(isIphone[2].replace('_', '.')) : 0;
      if (iosVersion >= 16.1) {
        setTimeout(() => {
          if (window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta !== null) {
            window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta.focus();
            window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta = null;
          }
        }, 200);
      } else {
        if (window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta !== null) {
          window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta.focus();
          window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta = null;
        }
      }
    }
  }

  PopupConfirm.instances = new WeakMap();

  function keydownLayer(evt) {
    if (evt.shiftKey && window.sg.common.constants.KEY_CODE.TAB === evt.keyCode && evt.target === $q(selector.section).find(selector.focusEl).target[0]) {
      evt.preventDefault();
      document.querySelector(`${selector.section} ${selector.close}`).focus();
    }
  }

  function keydownCloseBtn(evt) {
    if (!evt.shiftKey && window.sg.common.constants.KEY_CODE.TAB === evt.keyCode) {
      evt.preventDefault();
      $q(selector.section).find(selector.focusEl).target[0].focus();
    }
  }

  function showPopup(callCta = null) {
    state.preventAutoScroll = true;
    document.querySelector('.pd21-confirm-popup').style.display = 'block';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        state.preventAutoScroll = false;
      });
    });

    const agent = window.navigator.userAgent;
    const isIphone = agent.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const iosVersion = isIphone ? parseFloat(isIphone[2].replace('_', '.')) : 0;
    const focusEl = $q('.pd21-confirm-popup').find(selector.focusEl).target[0];
    // if (iosVersion >= 16.1) {
    //   focusEl.blur();
    //   setTimeout(() => {
    //     focusEl.focus();
    //   }, 200);
    // } else {
    //   focusEl.focus();
    // }

    const firstFocusEl = $q(selector.section).find(selector.focusEl).target[0];
    firstFocusEl.removeEventListener('keydown', keydownLayer);
    firstFocusEl.addEventListener('keydown', keydownLayer);

    utilsShow();

    const productCardList = $q('.pd13-offers-product-card-list');
    const productFinder = $q('.pd21-product-finder');
    const confirmPop = $q('.pd21-confirm-popup');

    if (window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta !== null) {
      window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta = null;
    }

    if (callCta !== null) {
      if (callCta instanceof Element) {
        window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta = callCta;
      } else if (callCta instanceof Object) {
        if (callCta[0] instanceof Element) {
          window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta = callCta[0];
        } else {
          window.sg.components.Pd21Modules.ConfirmPopup.popupCallCta = callCta.target[0];
        }
      }
    }

    if (productCardList.target.length > 0 || productFinder.target.length > 0) {
      if (confirmPop.attr('data-aria-hidden')) { //call in popup
        confirmPop.attr('aria-hidden', 'false');
        const callLayer = ['.pd-get-stock-alert-popup', '.pd21-compare-popup'];

        callLayer.forEach((layerEl) => {
          if ($q(layerEl).css('display') === 'block') {
            $q(layerEl).attr('data-aria-hidden', null);
            $q(layerEl).attr('aria-hidden', 'true');
          }
        });
      } else {
        setMobileFocusLoop(confirmPop.target[0]);
      }
    } else {
      if (document.querySelectorAll('[data-aria-hidden]').length === 0) {
        setMobileFocusLoop(confirmPop.target[0]);
      }
    }
  }

  function closePopup() {
    state.preventAutoScroll = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        state.preventAutoScroll = false;
      });
    });

    PopupConfirm.instances.get(document.querySelector('.pd21-confirm-popup')).close();
  }

  function utilsShow() {
    utils.popupControl.open(closePopup);
    window.sg.components.Pd21Modules.Utils.hiddenScroll();
  }

  function utilsHide() {
    utils.popupControl.close();
    window.sg.components.Pd21Modules.Utils.visibleScroll();
  }

  const confirmPopup = {
    initAll() {
      [...document.querySelectorAll('.pd21-confirm-popup')].forEach((el) => {
        if (!PopupConfirm.instances.has(el)) {
          new PopupConfirm(el);
        }
      });
    },
    showPopup,
  };

  // Attach to pd21Modules
  pd21Modules.ConfirmPopup = confirmPopup;

  $q.ready(confirmPopup.initAll);
})();

(() => {
  const $q = window.sg.common.$q;
  const utils = window.sg.common.utils;
  const lazyLoad = window.sg.common.lazyLoad;
  const scrollbar = window.sg.common.scrollbar;

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;

  const selector = {
    section: '.pd21-compare-popup',
  };

  class Pd21ComparePopup {
    constructor(element) {
      this.el = {
        document: $q(document),
        window: $q(window),
        section: $q(element),
      };

      this.selector = {
        section: selector.section,
        layerPopupEl: '.layer-popup',
        popupDim: '.pd21-compare-popup__dim',
        layerPopupInnerEl: '.layer-popup__inner',
        headlineWrapEl: '.pd21-compare-popup__headline-wrap',
        productSkuEl: '.pd21-compare-popup__product-sku',
        productFixedEl: '.pd21-compare-popup__product-fixed',
        productWrapEl: '.pd21-compare-popup__product-wrap',
        filterSwitchBtnEl: '.pd21-compare-popup__filter-switch .switch-v2__button',
        specWrapEl: '.pd21-compare-popup__spec-wrap',
        specRowEl: '.pd21-compare-popup__spec-row',
        specContentsEl: '.pd21-compare-popup__spec-contents',
        specContentsHighlight: '.pd21-compare-popup__spec-contents--highlight',
        specTooltipEl: '.pd21-compare-popup__spec-tooltip',
        specTooltipPopupEl: '.pd21-compare-popup__spec-tooltip-popup',
        specTooltipOpenEl: '.pd21-compare-popup__spec-tooltip-open',
        specTooltipCloseEl: '.pd21-compare-popup__spec-tooltip-close',
        horizontalScrollbarEl: '.pd21-compare-popup__horizontal-scrollbar > .scrollbar__wrap',
        popupContentsEl: '.layer-popup__contents',
        verticalScrollbarEl: '.layer-popup__contents > .scrollbar__wrap',
        itemWrap: '.pd21-compare-popup__card-item',
        optionSelectorWrap: '.pd21-compare-popup__card-option-selector',
        colorName: '.option-selector-v3__color-name',
        colorNameText: '.option-selector-v3__color-name > span',
        colorNameTooltip: '.pd21-compare-popup__card-color-tooltip',
        colorNameTooltipText: '.pd21-compare-popup__card-color-tooltip-text',
        colorNameTooltipClose: '.pd21-compare-popup__card-color-tooltip--close-btn',
        closeButton: '.layer-popup__close',
        capacitySelectorWrap: '.option-selector-v3__wrap--capacity',
        capacitySelectorList: '.option-selector-v3__list',
        capacitySelectorBtn: '.option-selector-v3__size',
        capacityMobileSelector: '.pd21-compare-popup__card-mobile-option',
        repairabilityImg: '.offers-product-card-grid__repairability img',
        sameHeightTarget: [
          '.pd21-compare-popup__product-sku-item',
          '.pd21-compare-popup__product-fixed-title',
          '.pd21-compare-popup__feature-title',
          '.pd21-compare-popup__card-rating-wrap',
          '.pd21-compare-popup__card-img-wrap',
          '.option-selector-v3__color-name',
          '.pd21-compare-popup__card-option--colorchip',
          '.pd21-compare-popup__card-option--capacity',
          '.pd21-compare-popup__card-fiche-wrap',
          '.pd21-compare-popup__card-cta--primary',
          '.pd21-compare-popup__card-cta--secondary',
        ],
        tooltip: '[data-js-action="pd21TooltipContainer"]',
        tooltipLayer: '[data-js-action="pd21TooltipLayer"]',
        tooltipShow: '[data-js-action="pd21TooltipShow"]',
        tooltipHide: '[data-js-action="pd21TooltipHide"]',
        tooltipHover: 'data-tooltip-hover',
      };

      this.classes = {
        popupShow: 'pd21-compare-popup--show',
        popupAnimate: 'pd21-compare-popup--animate',
        tooltipShow: 'pd21-compare-popup__card-color-tooltip--show',
        isActive: 'pd21-compare-popup--active',
        isHidden: 'pd21-compare-popup--hidden',
        isOn: 'on',
        isChecked: 'pd21-compare-popup--checked',
        isEmpty: 'pd21-compare-popup--empty',
        cardOptionActive: 'pd21-compare-popup__card-option--option-active',
        cardSelectorActive: 'pd21-compare-popup__card-option--selector-active',
      };

      this.scrollLeft = 0;
      this.focusTargetEl = null;
      this.currentDevice = null;
      this.isTransitionEnd = false;
      this.maximumNumber = 41;

      this.handler = {
        tooltipToggle: this.tooltipToggle.bind(this),
        tooltipClose: this.tooltipClose.bind(this),
        resize: this.resize.bind(this),
        horizontalHandleScroll: this.horizontalHandleScroll.bind(this),
        verticalHandleScroll: this.verticalHandleScroll.bind(this),
        handleDifferenceToggle: this.handleDifferenceToggle.bind(this),
        tooltipControl: this.tooltipControl.bind(this),
        tooltipControlClose: this.tooltipControlClose.bind(this),
        closePopup: this.closePopup.bind(this),
        changeCapacityOption: this.changeCapacityOption.bind(this),
        layerPopupInnerTransitionEnd: this.layerPopupInnerTransitionEnd.bind(this),
        handleTooltipOpen: this.handleTooltipOpen.bind(this),
        handleTooltipClose: this.handleTooltipClose.bind(this),
      };

      this.init();

      Pd21ComparePopup.instances.set(element, this);
    }

    init() {
      this.initScroll();
      this.setElements();
      this.resize();
      this.productTitleSticky();
      this.bindEvents();
      this.currentDevice = utils.getCurrentDevice();

      this.el.section.find(this.selector.repairabilityImg).target.forEach((el) => {
        window.sg.common.image.reInit(el);
      });
      lazyLoad.setLazyLoad();
      window.sg.common.switchv2.initAll();
    }

    reInit() {
      this.initScroll();
      this.setElements();
      this.resize();
      this.productTitleSticky();
      this.bindEvents();
      this.currentDevice = utils.getCurrentDevice();

      this.el.section.find(this.selector.repairabilityImg).target.forEach((el) => {
        window.sg.common.image.reInit(el);
      });
      lazyLoad.setLazyLoad();
      window.sg.common.switchv2.initAll();
    }

    initScroll() {
      this.el.section.find('.scrollbar').target.forEach((el) => {
        scrollbar.reInit(el);
      });
    }

    setElements() {
      this.el.popupDim = this.el.section.find(this.selector.popupDim);
      this.el.layerPopupEl = this.el.section.find(this.selector.layerPopupEl);
      this.el.layerPopupInnerEl = this.el.section.find(this.selector.layerPopupInnerEl);
      this.el.headlineWrapEl = this.el.section.find(this.selector.headlineWrapEl);
      this.el.productSkuEl = this.el.section.find(this.selector.productSkuEl);
      this.el.filterSwitchBtnEl = this.el.section.find(this.selector.filterSwitchBtnEl);
      this.el.specTooltipOpenEl = this.el.section.find(this.selector.specTooltipOpenEl);
      this.el.specTooltipCloseEl = this.el.section.find(this.selector.specTooltipCloseEl);
      this.el.productFixedEl = this.el.section.find(this.selector.productFixedEl);
      this.el.productWrapEl = this.el.section.find(this.selector.productWrapEl);
      this.el.popupContentsEl = this.el.section.find(this.selector.popupContentsEl);
      this.el.horizontalScrollbarEl = this.el.section.find(this.selector.horizontalScrollbarEl);
      this.el.verticalScrollbarEl = this.el.section.find(this.selector.verticalScrollbarEl);
      this.el.itemWrap = this.el.section.find(this.selector.itemWrap);
      this.el.colorName = this.el.section.find(this.selector.colorName);
      this.el.tooltipClose = this.el.section.find(this.selector.tooltipClose);
      this.el.colorNameText = this.el.section.find(this.selector.colorNameText);
      this.el.colorNameTooltip = this.el.section.find(this.selector.colorNameTooltip);
      this.el.colorNameTooltipClose = this.el.section.find(this.selector.colorNameTooltipClose);
      this.el.closeButton = this.el.section.find(this.selector.closeButton);
      this.el.capacitySelectorWrap = this.el.section.find(this.selector.capacitySelectorWrap);
      this.el.capacitySelectorList = this.el.capacitySelectorWrap.find(this.selector.capacitySelectorList);
      this.el.capacitySelectorBtn = this.el.section.find(this.selector.capacitySelectorBtn);
      this.el.capacityMobileSelector = this.el.section.find(this.selector.capacityMobileSelector);
    }

    bindEvents() {
      this.el.window.off('resize', this.handler.resize).on('resize', this.handler.resize);
      this.el.horizontalScrollbarEl.off('scroll', this.handler.horizontalHandleScroll).on('scroll', this.handler.horizontalHandleScroll);
      this.el.verticalScrollbarEl.off('scroll', this.handler.verticalHandleScroll).on('scroll', this.handler.verticalHandleScroll);
      this.el.filterSwitchBtnEl.off('click', this.handler.handleDifferenceToggle).on('click', this.handler.handleDifferenceToggle);
      this.el.specTooltipOpenEl.off('click', (e) => this.handler.tooltipControl(e.currentTarget, 'open')).on('click', (e) => this.handler.tooltipControl(e.currentTarget, 'open'));
      this.el.specTooltipCloseEl.off('click', (e) => this.handler.tooltipControl(e.currentTarget, 'close')).on('click', (e) => this.handler.tooltipControl(e.currentTarget, 'close'));
      this.el.colorName.off('mouseover', this.handler.tooltipToggle).on('mouseover', this.handler.tooltipToggle);
      this.el.colorName.off('focusin', this.handler.tooltipToggle).on('focusin', this.handler.tooltipToggle);
      this.el.colorName.off('mouseout', this.handler.tooltipToggle).on('mouseout', this.handler.tooltipToggle);
      this.el.colorName.off('focusout', this.handler.tooltipToggle).on('focusout', this.handler.tooltipToggle);
      this.el.colorName.off('click', this.handler.tooltipToggle).on('click', this.handler.tooltipToggle);
      this.el.colorNameTooltipClose.off('click', this.handler.tooltipClose).on('click', this.handler.tooltipClose);
      this.el.capacitySelectorBtn.off('click', this.handler.changeCapacityOption).on('click', this.handler.changeCapacityOption);
      this.el.capacityMobileSelector.off('change', this.handler.changeCapacityOption).on('change', this.handler.changeCapacityOption);
      this.el.layerPopupInnerEl.off('transitionend', this.handler.layerPopupInnerTransitionEnd).on('transitionend',this.handler.layerPopupInnerTransitionEnd);
      this.el.popupDim.off('click', this.handler.closePopup).on('click', this.handler.closePopup);

      window.dispatchEvent(new Event('resize'));
    }

    showPopup(targetEl) {
      state.preventAutoScroll = true;
      this.focusTargetEl = targetEl;
      this.el.section.addClass(this.classes.popupShow);
      this.reInitTooltip();
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.el.section.addClass(this.classes.popupAnimate); // ← delayed for smooth animation
          state.preventAutoScroll = false;
        });
      });

      this.el.closeButton.off('click', this.handler.closePopup).on('click', this.handler.closePopup);

      this.setHeight();

      if (this.el.verticalScrollbarEl.target[0]) {
        this.el.verticalScrollbarEl.target[0].scrollTop = 0;
      }
      if (this.el.horizontalScrollbarEl.target[0]) {
        this.el.horizontalScrollbarEl.target[0].scrollLeft = 0;
      }
      this.scrollLeft = 0;

      this.el.productFixedEl.removeClass(this.classes.isActive);
      this.el.productFixedEl.css({ 'transform': `translate3d(0px, 0, 0)` });
      this.el.productFixedEl.css({ 'top': '0px' });
      this.el.productWrapEl.css({ 'margin-top': '0' });

      window.sg.components.Pd21Modules.Utils.hiddenScroll();
      lazyLoad.forceLoad(this.el.section.target[0]);

      this.el.section.setLayerFocus(this.selector.layerPopupEl, this.selector.closeButton);

      window.dispatchEvent(new Event('resize'));
    }

    closePopup() {
      state.preventAutoScroll = true;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          state.preventAutoScroll = false;
        });
      });
      
      this.savedScrollTop = 0;
      this.el.section.removeClass(this.classes.popupAnimate);

      this.el.section.offLayerFocus();

      if (this.focusTargetEl && this.focusTargetEl instanceof Element) {
        this.focusTargetEl.focus();
        this.focusTargetEl = null;
      }

      window.sg.components.Pd21Modules.Utils.visibleScroll();
    }

    layerPopupInnerTransitionEnd() {
      this.productTitleSticky();
      this.isTransitionEnd = true;
      if ( this.isTransitionEnd && !this.el.section.hasClass(this.classes.popupAnimate) ){
        this.el.section.removeClass(this.classes.popupShow);
        this.isTransitionEnd = false;
      }
    }

    productTitleSticky() {
      this.el.layerPopupInnerEl.css({ 'height': `${window.innerHeight * 0.9}px` });
      this.titleStickyTop = this.el.section.find('.layer-popup__contents').target[0].getBoundingClientRect().top;
    }

    tooltipToggle(e) {
      const targetColorName = $q(e.currentTarget).closest(this.selector.optionSelectorWrap).find(this.selector.colorNameTooltip);
      const colorNameText = $q(e.currentTarget).closest(this.selector.colorName).target[0].querySelector(this.selector.colorNameText);
      const colorNameTextLength = colorNameText.innerText.length;

      if (colorNameTextLength < this.maximumNumber) return;

      if (this.currDevice === 'desktop') {
        if (e.type === 'mouseover' || e.type === 'focusin') {
          targetColorName.addClass(this.classes.tooltipShow);
        } else if (e.type === 'mouseout' || e.type === 'focusout') {
          targetColorName.removeClass(this.classes.tooltipShow);
        }
      } else {
        if (e.type === 'click') {
          const isCurrentlyOpen = targetColorName.hasClass(this.classes.tooltipShow);
          $q(this.selector.colorNameTooltip).removeClass(this.classes.tooltipShow);
          if (!isCurrentlyOpen) {
            targetColorName.addClass(this.classes.tooltipShow);
          }
        }
      }
    }

    tooltipClose(e) {
      const targetColorName = $q(e.currentTarget).closest(this.selector.optionSelectorWrap).find(this.selector.colorNameTooltip);

      if (targetColorName.hasClass(this.classes.tooltipShow)) {
        targetColorName.removeClass(this.classes.tooltipShow);
      }
    }

    setHeight() {
      const scrollEl = this.el.verticalScrollbarEl.target[0];
      const savedScrollTop = scrollEl ? scrollEl.scrollTop : 0;

      const outsideCardSelectors = [
        '.pd21-compare-popup__product-sku-item',
        '.pd21-compare-popup__product-fixed-title',
        '.pd21-compare-popup__feature-title',
      ];

      const insideCardSelectors = [
        '.pd21-compare-popup__card-rating-wrap',
        '.pd21-compare-popup__card-img-wrap',
        '.option-selector-v3__color-name',
        '.pd21-compare-popup__card-option--colorchip',
        '.pd21-compare-popup__card-option--capacity',
        '.pd21-compare-popup__card-fiche-wrap',
        '.pd21-compare-popup__card-current-price',
        '.pd21-compare-popup__card-price-sub',
        '.pd21-compare-popup__card-cta--primary',
        '.pd21-compare-popup__card-cta--secondary',
      ];

      const cardSelector = '.pd21-compare-popup__card-item';
      const colsInRow = state.compareSelectedItems.length;
      const allCards = Array.from(this.el.section.find(cardSelector).target);
      if (!allCards.length) return;

      const allSelectors = [...outsideCardSelectors, ...insideCardSelectors];
      allSelectors.forEach(sel => {
        this.el.section.find(sel).target.forEach(el => {
          el.style.height = 'auto';
        });
      });

      // Build rows
      const rows = [];
      let currentRow = [];
      allCards.forEach(card => {
        currentRow.push(card);
        if (currentRow.length === colsInRow) {
          rows.push(currentRow);
          currentRow = [];
        }
      });
      if (currentRow.length) rows.push(currentRow);

      const applyHeight = (elements) => {
        const maxHeight = Math.max(...elements.map(el => el.offsetHeight));

        elements.forEach(el => {
          el.style.height = `${maxHeight}px`;
        });
      };

      outsideCardSelectors.forEach(sel => {
        const elements = this.el.section.find(sel).target;
        if (elements.length) applyHeight(elements);
      });

      rows.forEach(rowCards => {
        insideCardSelectors.forEach(sel => {
          const elements = rowCards.map(card => card.querySelector(sel)).filter(Boolean);
          if (elements.length) applyHeight(elements);
        });
      });

      if (scrollEl) {
        scrollEl.scrollTop = savedScrollTop;
      }
    }

    handleDifferenceToggle() {
      const toggleButtonEl = this.el.filterSwitchBtnEl;
      this.initScroll();

      if (toggleButtonEl.hasClass(this.classes.isOn)) {
        // on
        const targetRows = this.el.section.find(`${this.selector.specWrapEl}:not(:has(${this.selector.specContentsHighlight}))`);
        targetRows.hide();
      } else {
        // off
        const targetRows = this.el.section.find(this.selector.specWrapEl);
        targetRows.show();
      }
    }

    verticalHandleScroll() {
      const scrollTop = this.el.verticalScrollbarEl.target[0] ? this.el.verticalScrollbarEl.target[0].scrollTop : 0;
      const prevHeight = this.el.headlineWrapEl.offset().height + this.el.productSkuEl.offset().height;
      const productFixedElHeight = this.el.productFixedEl.offset().height;

      if (scrollTop > prevHeight) {
        this.el.productFixedEl.addClass(this.classes.isActive);
        if (this.currDevice === 'desktop') {
          this.el.productFixedEl.css({ 'transform': `translate3d(-${0}px, 0, 0)` });
        } else {
          this.el.productFixedEl.css({ 'transform': `translate3d(-${this.scrollLeft}px, 0, 0)` });
        }
        this.el.productWrapEl.css({ 'margin-top': `${productFixedElHeight}px` });
        // // this.el.productFixedEl.css({ 'top': `${scrollTop - 139}px` });//임시
        // this.el.productFixedEl.css({ 'top': `${0}px` });
      } else {
        this.el.productFixedEl.removeClass(this.classes.isActive);
        this.el.productFixedEl.css({ 'transform': `translate3d(-${0}px, 0, 0)` });
        this.el.productFixedEl.css({ 'top': '0px' });
        this.el.productWrapEl.css({ 'margin-top': '0' });
      }
    }

    horizontalHandleScroll() {
      if (!this.el.horizontalScrollbarEl.target.length) return;
      this.productTitleSticky();
      this.scrollLeft = utils.getNormalizedScrollLeft(this.el.horizontalScrollbarEl.target[0]);
      if (this.el.productFixedEl.hasClass(this.classes.isActive)) {
        this.el.productFixedEl.css({ 'transform': `translate3d(-${this.scrollLeft}px, 0, 0)` });
      }
    }

    tooltipControl(tooltip, type) {
      const specTooltipEl = tooltip.closest(this.selector.specTooltipEl);
      const specTooltipPopupEl = $q(specTooltipEl).find(this.selector.specTooltipPopupEl);
      const OPEN = type === 'open';
      const CLOSE = type === 'close';
      if (OPEN) {
        specTooltipPopupEl.addClass(this.classes.isActive);
      } else if (CLOSE) {
        specTooltipPopupEl.removeClass(this.classes.isActive);
      }
    }

    tooltipControlClose(e) {
      if (!e.target.closest(this.selector.specTooltipEl)) {
        const specTooltipPopupEl = $q(this.selector.specTooltipEl).find(this.selector.specTooltipPopupEl);
        specTooltipPopupEl.removeClass(this.classes.isActive);
      }
    }

    setCapacityValue() {
      if (utils.getCurrentDevice() === 'desktop') {
        this.pcCapacityArr = [];
        this.el.capacitySelectorList.target.forEach((element) => {
          element.querySelectorAll('.option-selector-v3__item').forEach((element) => {
            if (element.classList.contains(this.classes.isChecked)) {
              this.pcCapacityArr.push(element.querySelector('.option-selector-v3__size-text').innerText);
            }
          });
        });
      } else {
        this.mobileCapacityArr = [];
        this.el.capacityMobileSelector.target.forEach((element) => {
          this.mobileCapacityArr.push(element[element.selectedIndex].value);
        });
      }
    }

    setCapacity() {
      if (utils.getCurrentDevice() === 'desktop') {
        if (this.mobileCapacityArr === undefined) return;

        this.el.capacitySelectorList.target.forEach((element, index) => {
          this.idx = index;
          element.querySelectorAll('.option-selector-v3__item').forEach((element) => {
            element.classList.remove(this.classes.isChecked);
            if (element.querySelector('.option-selector-v3__size-text').innerText === this.mobileCapacityArr[this.idx]) {
              element.classList.add(this.classes.isChecked);
            }
          });
        });
      } else {
        if (this.pcCapacityArr === undefined) return;

        this.el.capacityMobileSelector.target.forEach((element, index) => {
          const len = element.options.length;
          for (let i = 0; i < len; i++) {
            if (element.options[i].value === this.pcCapacityArr[index]) {
              element.options[i].selected = true;
            }
          }
        });
      }
    }

    changeCapacityOption() {
      this.setCapacityValue();
    }

    handleCapacityChange() {
      if (this.currDevice === 'desktop') return;

      this.el.capacityMobileSelector.target.forEach((element) => {
        if (element.length === 1) {
          element.parentNode.parentNode.classList.add(this.classes.cardOptionActive);
        } else if (element.length > 1) {
          element.parentNode.parentNode.classList.add(this.classes.cardSelectorActive);
        }
      });
    }

    resize() {
      const currentDevice = utils.getCurrentDevice();

      if (this.currDevice !== currentDevice) {
        setTimeout(() => {
          this.handleBreakpointChange();
        }, 10);
      }
      this.productTitleSticky();
      this.setHeight();
      this.horizontalHandleScroll();
      this.verticalHandleScroll();
      this.handleCapacityChange();
      this.currDevice = currentDevice;
    }

    handleBreakpointChange() {
      this.currDevice = utils.getCurrentDevice();
      this.productTitleSticky();
      this.setHeight();
      this.setCapacityValue();
      this.setCapacity();
      this.handleCapacityChange();      
    }

    reInitTooltip() {
      this.el.tooltipOpen = this.el.section.find(this.selector.tooltipShow);

      this.el.tooltipOpen.target.forEach((el) => {
        const tooltipOpen = $q(el);
        const isHover = tooltipOpen.closest(this.selector.tooltip).attr(this.selector.tooltipHover);

        if (isHover !== 'false') {
          tooltipOpen.off('mouseenter').on('mouseenter', (e) => this.handler.handleTooltipOpen(e, this.isTooltipOverflow.bind(this)));
          tooltipOpen.off('focus').on('focus', (e) => this.handler.handleTooltipOpen(e, this.isTooltipOverflow.bind(this)));
        }

        tooltipOpen.off('click').on('click', (e) => this.handler.handleTooltipOpen(e, this.isTooltipOverflow.bind(this)));
      });
    }

    handleTooltipOpen(e, callback) {
      const openBtn = $q(e.currentTarget);
      const targetTooltip = openBtn.closest(this.selector.tooltip);
      const newFocus = e.relatedTarget || document.activeElement;
      const closeBtn = targetTooltip.find(this.selector.tooltipHide);
      const isHover = targetTooltip.attr(this.selector.tooltipHover);

      // click open toggle
      if (isHover === 'false' && e.type === 'click' && targetTooltip.attr('data-tooltip-show') === 'true') {
        this.tooltipClose(targetTooltip);
        return;
      }

      // 포커스 이동이 같은 컨테이너 일 때 return
      if (e.type === 'focus' && targetTooltip.target[0].contains(newFocus)) return;

      this.focusTargetEl = e && e.currentTarget;

      // 툴팁 오픈 전 모든 툴팁 닫기
      this.tooltipClose();

      // hover open event bind
      if (isHover !== 'false') {
        targetTooltip.off('mouseleave', this.handler.handleTooltipClose).on('mouseleave', this.handler.handleTooltipClose);
        targetTooltip.off('focusout', this.handler.handleTooltipClose).on('focusout', this.handler.handleTooltipClose);
      }

      closeBtn.off('click', this.handler.handleTooltipClose).on('click', this.handler.handleTooltipClose);

      setTimeout(() => {
        $q(document).off('click', this.handler.handleTooltipClose).on('click', this.handler.handleTooltipClose);
        $q(document).off('keydown', this.handler.handleTooltipClose).on('keydown', this.handler.handleTooltipClose);
      }, 10);

      openBtn.attr('aria-expanded', true);
      targetTooltip.attr('data-tooltip-show', true);

      this.resetCallback = callback(targetTooltip.target[0]);
    }

    handleTooltipClose(e) {
      const evtType = e.type;
      const evtTarget = $q(e.target);
      const newFocus = e.relatedTarget || document.activeElement;
      const targetTooltip = evtTarget.closest(this.selector.tooltip);

      if (evtType === 'focusout' && targetTooltip.target[0].contains(newFocus)) return;
      if (evtType === 'keydown' && e.keyCode !== KEY_CODE.ESC) return;
      if (evtType === 'click' && !evtTarget.closest(this.selector.tooltipHide).target.length && evtTarget.closest(this.selector.tooltip).target.length) return;

      this.tooltipClose();

      this.resetCallback && this.resetCallback();
      this.resetCallback = null;

      // focusout el과 return focus el 이 같을 경우, mouseleave일 경우 예외적용
      this.focusTargetEl && (this.focusTargetEl !== evtTarget.target[0]) && (evtType !== 'mouseleave') && this.focusTargetEl.focus();
      this.focusTargetEl = null;
    }

    tooltipClose(tooltip) {
      const targetTooltip = !tooltip ? this.el.section.find(this.selector.tooltip) : (tooltip.target ? tooltip : $q(tooltip));
      const openBtn = targetTooltip.find(this.selector.tooltipShow);
      const closeBtn = targetTooltip.find(this.selector.tooltipHide);

      targetTooltip.off('mouseleave', this.handler.handleTooltipClose);
      targetTooltip.off('focusout', this.handler.handleTooltipClose);

      closeBtn.off('click', this.handler.handleTooltipClose);

      $q(document).off('click', this.handler.handleTooltipClose);
      $q(document).off('keydown', this.handler.handleTooltipClose);

      openBtn.attr('aria-expanded', false);
      targetTooltip.attr('data-tooltip-show', false);
    }

    isTooltipOverflow(tooltip) {
      const targetTooltip = $q(tooltip);
      const tooltipLayerOffset = targetTooltip.find(this.selector.tooltipLayer).offset();

      if (tooltipLayerOffset.right > window.innerWidth) {
        targetTooltip.attr('data-tooltip-overflow', true);
      }

      return function () {
        targetTooltip.attr('data-tooltip-overflow', false);
      };
    }
  }

  function init() {
    $q(selector.section).target.forEach((element) => {
      if (!Pd21ComparePopup.instances.has(element)) {
        new Pd21ComparePopup(element);
      }
    });
  }

  function reInit() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ComparePopup.instances.has(element)) {
        Pd21ComparePopup.instances.get(element).reInit();
      } else {
        new Pd21ComparePopup(element);
      }
    });
  }

  function showPopup(targetEl) {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ComparePopup.instances.has(element)) {
        Pd21ComparePopup.instances.get(element).showPopup(targetEl);
        window.sg.common.switchv2.initAll();
      }
    });
  }

  function closePopup() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ComparePopup.instances.has(element)) {
        Pd21ComparePopup.instances.get(element).closePopup();
      }
    });
  }

  function initScroll() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ComparePopup.instances.has(element)) {
        Pd21ComparePopup.instances.get(element).initScroll();
      }
    });
  }

  function reInitTooltip() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ComparePopup.instances.has(element)) {
        Pd21ComparePopup.instances.get(element).reInitTooltip();
      }
    });
  }

  function setHeight() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ComparePopup.instances.has(element)) {
        Pd21ComparePopup.instances.get(element).setHeight();
      }
    });
  }
  
  function handleDifferenceToggle() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ComparePopup.instances.has(element)) {
        Pd21ComparePopup.instances.get(element).handleDifferenceToggle();
      }
    });
  }

  Pd21ComparePopup.instances = new WeakMap();

  // Attach to pd21Modules
  pd21Modules.ComparePopup = {
    init,
    reInit,
    showPopup,
    closePopup,
    setHeight,
    handleDifferenceToggle,
    initScroll,
    reInitTooltip,
  };

  $q.ready(init);
})();
(function ($) {
  "use strict";

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;
  const utils = pd21Modules.Utils;
  const apis = pd21Modules.ApiService;
  const categoryUtils = pd21Modules.CategoryUtils;
  const isEpp =  $('#eppFlag').val() === 'Y';

  const ComparePopupComponent = (function ($) {
    const DOMAIN_NAME = utils.domainName;
		const pageTrack = $("#pfPageTrack").val();

    let isNotNull = function (_str) {
      return !fnIsNull(_str) && _str != "null";
    };

    const is_HA_Page = categoryUtils.isHAPage();
    const is_DA_Page = categoryUtils.isHEPage() || categoryUtils.isHAPage();
    const is_VD_Page = categoryUtils.isMonitorPage() || categoryUtils.isMemoryStoragePage();
    const is_MX_page = categoryUtils.isMobilePage();
    const isHomeAppliances = categoryUtils.isHAPage();
    const isBundlePage = categoryUtils.isBundlePage();

    function getProductName(item) {
      let productName = '';

      if (is_HA_Page || isBundlePage) {
        if (
          item.productShortTitle &&
          item.productShortTitle !== null &&
          item.productShortTitle !== undefined &&
          item.productShortTitle.length > 0
        ) {
          productName = item.productShortTitle;
        } else {
          productName = item.name;
        }
      } else if (is_MX_page) {
        if (item.familyMktName) {
          productName = item.familyMktName;
        } else if (item.productDisplayName) {
          productName = item.productDisplayName;
        } else {
          productName = item.name;
        }
      } else {
        if (item.productShortTitle) {
          productName = item.productShortTitle;
        } else if (item.productDisplayName) {
          productName = item.productDisplayName;
        } else {
          productName = item.name;
        }
      }

      return productName;
    }

    const escapeAttr = function (text) {
      let newText = text;
      if (newText) {
        newText = newText
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "\\&quot;")
          .replace(/'/g, "&#039;");
      }
      return newText;
    };

    let specsData = null;
    let localProductListData = [];
    let localChipBinderData = [];

    function alignElementsHeights() {
      window.sg.components.Pd21Modules.ComparePopup.setHeight();
    }

    function productCardModelCodeBuild(modelCode) {
      return `
        <li class="pd21-compare-popup__product-sku-item">
          <p class="pd21-compare-popup__product-sku-name">${utils.truncateText(modelCode, 35)}</p>
        </li>
      `;
    }

    function productCardModelNameBuild(item) {
      const productName = getProductName(item);

      return `
        <li class="pd21-compare-popup__product-fixed-item">
          <p class="pd21-compare-popup__product-fixed-title">${utils.truncateText(productName, 39)}</p>
        </li>
      `;
    }

    function productCardShortTitleBuild(item) {
      const productFeatureTitle = item.productFeatureTitle;
      const vdSubTitle = item.productFeatureTitle ? item.productFeatureTitle : '';
      if (!productFeatureTitle && !vdSubTitle) return '<div class="pd21-compare-popup__feature-title"></div>';

      function formatTitle(text) {
        return utils.truncateText(text, 30).split('|').join('<span class="pd21-compare-popup__feature-title-divider"></span>');
      }

      const featureTitleText = formatTitle(productFeatureTitle);
      const vdSubTitleText = formatTitle(vdSubTitle);

      return `${is_HA_Page || isBundlePage ? `<div class="pd21-compare-popup__feature-title">
        <p class="pd21-compare-popup__feature-title-text">${featureTitleText}</p>
      </div>` : (!is_HA_Page && !is_MX_page) ? `<div class="pd21-compare-popup__feature-title">
        <p class="pd21-compare-popup__feature-title-text">${vdSubTitleText}</p>
      </div>` : ''}`;
    }

    function productCardImageBuild(item) {
      const productImage = item?.galleryImage?.[0] || "";

      return `
        <div class="pd21-compare-popup__card-img-wrap">
          <div class="image">
            <img class="image__preview lazy-load responsive-img" data-desktop-src="${productImage}"
              data-mobile-src="${productImage}" alt="alt text" role="img" data-comp-name="image">
            <img class="image__main responsive-img lazy-load" data-desktop-src="${productImage}"
              data-mobile-src="${productImage}" alt="alt text" role="img" data-comp-name="image">
          </div>
        </div>
      `
    }

    function productCardReviewsBuild(item) {
      if (item.reviewRating === 0) return '<div class="pd21-compare-popup__card-rating-wrap"></div>';
      let starHtml = ''
      const rating = Number(item.reviewRating);
      const starCounts = 5;
      Array.from({ length: starCounts }).forEach((val, idx) => {
        const diff = rating - idx;
        const percentage = diff > 1 ? 1 : (diff > 0 ? diff : 0);
        starHtml += `<span id="${idx}" class="rating__star-item"><span class="rating__star-empty"></span><span class="rating__star-filled" style="width: ${percentage * 100}%;"></span></span>`
      });

      return `
        <div class="pd21-compare-popup__card-rating-wrap">
          <div class="pd21-compare-popup__card-rating-inner">
            <a 
              href="${item.linkUrlReview}"
              aria-label="go-review"
              class="pd21-compare-popup__card-rating js-click-feedback"
              data-feedback-param="${utils.escapeHtml(item.feedbackParam)}"
              an-tr="pdd27_compare pop_up-${pageTrack}-review-review1"
              an-ca="review"
              an-ac="product compare popup"
              an-la="read review"
              data-modelcode=${item.modelCode}
              data-modelname=${item.modelName}
            >
              <div class="rating-v2">
                <div class="rating-v2__wrap">
                  <div class="rating__star-list">
                    ${starHtml}
                  </div>
                  <div class="rating-v2__text-box">
                    <strong class="rating-v2__point">
                      <span class="hidden">Product Ratings :
                      </span>
                      <span class="rating-v2__point-text">${Number(item.reviewRating).toFixed(1)}</span>
                    </strong>
                    <strong class="rating-v2__review-count">
                      &#40;
                      <span class="hidden">Number of
                        Ratings:</span>
                      <span class="rating-v2__review-count-text">${utils.countGreaterThan(item.numberOfReviews, 4)}</span>
                      &#41;
                    </strong>
                  </div>
                </div>
              </div>
            </a>
            <div class="pd21-tooltip__container pd21-tooltip__container--rating" data-js-action="pd21TooltipContainer" data-tooltip-hover="true">
              ${productReviewsTooltipBuild(item)}
            </div>
          </div>
        </div>
      `
    }

    const productReviewsTooltipBuild = (item) => {
      if (item.reviewRating === 0) return "";

      let reviewUrl = '/' + siteCode + '/common/review/' + item.modelCode + '/';
      if (isNotNull(item.linkUrlReview)) {
        reviewUrl = item.linkUrlReview;
      }

      return `
        <button class="pd21-tooltip__button" data-modelcode="${item.modelCode}" data-js-action="pd21TooltipShow"><span class="hidden">Open Tooltip Layer</span></button>
        <div class="pd21-tooltip__layer" tabindex="-1" data-js-action="pd21TooltipLayer">
          <p class="pd21-tooltip__title">${Granite.I18n.get("Average Customer Ratings")}</p>
          <div class="pd21-tooltip__rating-list"></div>
          <a class="pd21-tooltip__link" href="${reviewUrl}">${Granite.I18n.get("See customer reviews")}</a>
          <button class="pd21-tooltip__close" data-js-action="pd21TooltipHide"><span class="hidden">Close Tooltip Layer</span></button>
        </div>
        `
    }

    function productCardFamilyOptionsBuild(item) {
      const productIdx = item.productIdx;
      const colorChipData = localChipBinderData[productIdx]?.chipOptions?.filter((el) => el.optionNameEng?.toLowerCase() == "color");
      const capacityChipData = localChipBinderData[productIdx]?.chipOptions?.filter((el) => el.optionNameEng?.toLowerCase() !== "color");

      const chosenColorLabel = colorChipData?.[0]?.optionValues.filter((el) => el.checked);
      const chosenColorOptionName = chosenColorLabel?.[0]?.optionValue || "";

      if (!colorChipData.length && !capacityChipData.length) {
        return `<div class="pd21-compare-popup__card-option-selector">
        <div class="pd21-compare-popup__card-option-wrap pd21-compare-popup__card-option--colorchip">
          <div class="pd21-compare-popup__card-option">
            <div class="option-selector-v3 option-selector-v3__color-text">
              <div class="option-selector-v3__color-name"></div>
              <div class="option-selector-v3__wrap option-selector-v3__wrap--color-chip"></div>
            </div>
          </div>
        </div>
        <div class="pd21-compare-popup__card-option-wrap pd21-compare-popup__card-option--capacity">
          <div class="pd21-compare-popup__card-option">
            <div class="option-selector-v3">
              <div class="option-selector-v3__wrap option-selector-v3__wrap--capacity"></div>
            </div>
            <div class="pd21-compare-popup__card-mobile-selector" data-comp-name="menu" data-type="filled">
              <select class="pd21-compare-popup__card-mobile-option"></select>
            </div>
          </div>
        </div>
        </div>
        `
      }

      function renderColorChips() {
        const colorChipOptionValues = colorChipData[0]?.optionValues || [];
        if (!colorChipOptionValues.length) return "";

        const totalOptions = colorChipOptionValues.length;

        let colorTooltipText = ''

        const chips = colorChipOptionValues.map((optn) => {
          colorTooltipText += `${optn.optionValue}, `

          return `
        <!--/* [D] disabled : add '.is-disabled' class and add 'disabled' property to 'button' tag */-->
          <!--/* [D] checked : add '.is-checked' class */-->
        <li
          class="option-selector-v3__item${optn.checked ? ' is-checked' : ''}${optn.disable ? ' is-disabled' : ''}"
          role="listitem" data-modeli="${item.modelCode}" data-chip-code="${optn.optionCode}"
              data-chip-value="${optn.optionValue}" data-productIdx=${productIdx} 
              data-chip-type="${colorChipData?.[0]?.optionNameEng}">
          <button 
            type="button"
            class="option-selector-v3__color" ${totalOptions === 1 ? "disabled" : ""}
            an-tr="pdd27_compare pop_up-${pageTrack}-option-option_click"
            an-ca="option click"
            an-ac="product compare popup"
            an-la="${colorChipData?.[0]?.optionName}:${optn.optionValue}"
            data-modelcode=${item.modelCode}
            data-modelname=${item.modelName}
          >
            <span class="option-selector-v3__color-code" style="background-color: ${optn.optionCode}"
              role="listitem">
              <span class="hidden">${colorTooltipText}</span>
            </span>
            ${optn.checked ? `<span class="blind">selected</span>` : ""}
          </button>
        </li>
      `
        }).join("");

        return chips;
      }

      function renderCapacityChips() {
        if (!capacityChipData.length) return "";

        const capacityChipOptionValues = capacityChipData[0]?.optionValues || [];
        if (!capacityChipOptionValues.length) return "";

        const totalOptions = capacityChipOptionValues.length;

        const chips = capacityChipOptionValues.map((optn) => {
          return `
      <!--/* [D] disabled : add '.is-disabled' class and add 'disabled' property to 'button' tag */-->
          <!--/* [D] checked : add '.is-checked' class */-->
        <li
          class="option-selector-v3__item${optn.checked ? ' is-checked' : ''}${optn.disable ? ' is-disabled' : ''}"
          role="listitem" data-modeli="${item.modelCode}"
            data-chip-code="${escapeAttr(optn.optionValue.toLowerCase().replace(/"/ig, ""))}" data-productIdx=${productIdx} 
            data-chip-type="${capacityChipData?.[0]?.optionNameEng}">
          <button 
            type="button"
            class="option-selector-v3__size" ${totalOptions === 1 ? "disabled" : ""}
            an-tr="pdd27_compare pop_up-${pageTrack}-option-option_click"
            an-ca="option click"
            an-ac="product compare popup"
            an-la="${capacityChipData?.[0]?.optionName}:${optn.optionValue}"
            data-modelcode=${item.modelCode}
            data-modelname=${item.modelName}
          >
            <span class="option-selector-v3__size-text">${utils.truncateText(optn.optionValue, 32)}</span>
            ${optn.checked ? `<span class="blind">selected</span>` : ""}
          </button>
        </li>
      `
        }).join("");

        return chips;
      }

      function renderDropdownCapacityChipsMobile() {
        if (!capacityChipData.length) return "";

        const capacityChipOptionValues = capacityChipData[0]?.optionValues || [];
        if (!capacityChipOptionValues.length) return "";

        const chips = capacityChipOptionValues.map((optn) => {
          return `
        <option class="option-selector-v3__item" value="${optn.optionValue}" ${optn.disable ? 'disabled' : ''} ${optn.checked ? 'selected' : ''}
          data-modeli="${item.modelCode}"
          data-chip-code="${escapeAttr(optn.optionValue.toLowerCase().replace(/"/ig, ""))}"
          data-productIdx=${productIdx} 
          data-chip-type="${capacityChipData?.[0]?.optionNameEng}">
         ${utils.truncateText(optn.optionValue, 12)}
        </option>
      `
        }).join("");

        return chips;
      }

      return `<div class="pd21-compare-popup__card-option-selector">
      <!--/* Colorchip */-->
      <div class="pd21-compare-popup__card-option-wrap pd21-compare-popup__card-option--colorchip">
        <div class="pd21-compare-popup__card-option">

          <!--/* [D] Color Chips 사용 시 .option-selector-v3__color-text 클래스 추가 (Color Chip을 사용 하지 않을 경우 .option-selector-v3__color-text 클래스 추가하지 말아주세요) */-->
          <div class="option-selector-v3 option-selector-v3__color-text">
            <!--/* Colorchip */-->
            <div class="option-selector-v3__color-name">
              <span>${chosenColorOptionName ? utils.truncateText(chosenColorOptionName, 41) : ""}</span>
            </div>
            <div class="option-selector-v3__wrap option-selector-v3__wrap--color-chip"
              data-global-text='{ "selected" : "selected" }'>
              <ul class="option-selector-v3__list" role="list">
                ${colorChipData.length ? renderColorChips() : ""}
              </ul>
            </div>
            <!--/* //Colorchip */-->
          </div>

          <!--/* [D] color name text가 길어져 1줄을 초과 할 경우 아래 tooltip 적용 */-->
          <div class="pd21-compare-popup__card-color-tooltip">
            <button class="pd21-compare-popup__card-color-tooltip--close-btn">
              <svg class="icon">
                <use xlink:href="#cancel-close-regular" href="#cancel-close-regular"></use>
              </svg>
            </button>
            Color : <span class="pd21-compare-popup__card-color-tooltip-text">
              ${chosenColorOptionName ? chosenColorOptionName : ""}
            </span>
          </div>
        </div>
      </div>

      <!--/* //Capacity */-->
      <div class="pd21-compare-popup__card-option-wrap pd21-compare-popup__card-option--capacity">
        <div class="pd21-compare-popup__card-option">

          <!--/* [D] Color Chips 사용 시 .option-selector-v3__color-text 클래스 추가 (Color Chip을 사용 하지 않을 경우 .option-selector-v3__color-text 클래스 추가하지 말아주세요) */-->
          <div class="option-selector-v3">

            <!--/* Capacity */-->
            <div class="option-selector-v3__wrap option-selector-v3__wrap--capacity"
              data-global-text='{ "selected" : "selected" }'>
              <ul class="option-selector-v3__list" role="list">
                <!--/* [D] disabled : add '.is-disabled' class and add 'disabled' property to 'button' tag */-->
                <!--/* [D] checked : add '.is-checked' class */-->
                ${renderCapacityChips()}
              </ul>
            </div>
          </div>
          <!--/* //Capacity */-->
          <div class="pd21-compare-popup__card-mobile-selector" data-comp-name="menu" data-type="filled">
            <select class="pd21-compare-popup__card-mobile-option" data-default-message="Select Item"
              data-select-aria-label="Sort" tabindex="-1" an-tr="pdd27_compare pop_up-${pageTrack}-view more-indication"
              an-ca="indication" an-ac="view more" an-la="product compare popup:view more">
              ${renderDropdownCapacityChipsMobile()}
            </select>
            <div class="pd21-compare-popup__card-mobile-open">
              <span class="hidden">open</span>
              <svg class="icon" width="17.64" height="9.829" viewBox="0 0 17.64 9.829">
                <path d="M452.929,60.085l.89.877L445,69.915l-8.82-8.952.89-.877L445,68.134Z"
                  transform="translate(-436.179 -60.085)" />
              </svg>
            </div>
          </div>
          <!--/* // [D] 모바일 셀렉터 */-->
        </div>
      </div>
      </div>
      `
    }

    function productCardPricingBuild(item) {
      const saveFlag = item.sale_price_currency && item.sale_price_currency != item.msrp_price_currency;

      return `
        <div class="pd21-compare-popup__card-price-wrap">
          <div class="pd21-compare-popup__card-price">
            <strong class="pd21-compare-popup__card-current-price ">${item.sale_price_currency ? utils.truncateText(item.sale_price_currency, 20) : ""}</strong>
            <!--/* <p class="pd21-compare-popup__card-price-installment"></p> */-->
            <div class="pd21-compare-popup__card-price-sub">
            <!--/* <strong class="hidden">Original Price : </strong> */-->
                <!--/* <del class="pd21-compare-popup__card-price-original"></del> */-->
              ${saveFlag ? `<strong class="hidden">Save Price : </strong>
              <span class="pd21-compare-popup__card-price-save">Save $${utils.truncateText(Number(item.msrp_price - item.sale_price).toFixed(2), 30)}</span>` : ""}
            </div>
          </div>
        </div>
      `
    }

    function productCardEnergyStarBuild(item) {
      let content = '<div class="pd21-compare-popup__card-fiche-wrap"></div>';

      if ((is_DA_Page || is_VD_Page) && item?.energyStarFlg && item?.energyStarFlg === 'Y') {
        content = `
          <div class="pd21-compare-popup__card-fiche-wrap">
            <div class="pd21-compare-popup__card-fiche">
              <div class="badge-energy-label">
                <a class="badge-energy-label__text" href="#" target="_blank" aria-label="text title">Energy Star Certified</a>
                <a class="" href="#" target="_blank" aria-label="badge title">A</a>
              </div>
              <a href="" class="" target="_blank">
                <img class="pd21-compare-popup__card-fiche-icon" src="https://image-us.samsung.com/us/b2c_pf/badge/v2/energy-star-logo@2x.png" alt="Enegry Star Certified Label" width="24" height="24">
              </a>
            </div>
          </div>
        `
      }

      return content;
    }

    function productCardCTABuild(item) {
      const modelCode = item.modelCode;
      const groupId = item.group_id;

      let buyLink = item.consumerUrl || item.pdpURL || '';
      let ctaText = '';
      let isNotifyMe = false;

      let wtbUrl = item.wtbUrl;
      if (!wtbUrl) {
        wtbUrl = utils.generateWtbUrl(item?.consumerUrl, item?.modelCode);
      }

      if (item?.ecomFlag === 'Y') {
        switch (item?.stockFlag) {
            case 'Y':
            case 'B':
              ctaText = 'Buy';
              break;
            case 'P':
              ctaText = 'Pre-order';
              break;
            case 'R':
              ctaText = 'Reserve now';
              break;
            case 'E':
              ctaText = 'Notify me';
              isNotifyMe = true;
              break;
            case 'N':
              if (isEpp) {
                ctaText = 'Buy';
              } else {
                ctaText = 'Notify me';
                isNotifyMe = true;
              }
              break;
            default:
              if (isEpp) {
                ctaText = 'Buy';
              } else {
                ctaText = 'Buy';
              }
          }
        } else {
          if (isEpp) {
            ctaText = 'Buy';
          } else {
            buyLink = wtbUrl;
            ctaText = 'Where to buy';
          }
        }

      let learnMoreUrl = '';
      if (item.mlpUrl) {
        learnMoreUrl = item.mlpUrl;
      } else if (item.pdpURL) {
        const anchor = is_MX_page ? '' : is_HA_Page ? '#benefits' : '#highlights';
        learnMoreUrl = item.pdpURL + anchor;
      } else {
        learnMoreUrl = '';
      }

      return `
      <div class="pd21-compare-popup__card-cta-wrap">
        <div class="pd21-compare-popup__card-cta pd21-compare-popup__card-cta--primary">
          ${isNotifyMe ? `
          <button 
            class="cta cta--contained cta--black pd21-compare-popup__cta--filled js-cta-stock js-click-feedback"
            data-feedback-param="${utils.escapeHtml(item.feedbackParam)}"
            an-tr="pdd27_compare pop_up-${pageTrack}-buy now/pre-order-buy_cta2"
            an-ca="buy cta"
            an-ac="${ctaText}"
            an-la="product compare popup:${ctaText}"
            data-modelcode=${item.modelCode}
            data-modelname=${item.modelName}
          >
            ${utils.truncateText(ctaText, 24)}
          </button>
          ` : `
          <a 
            class="cta cta--contained cta--black pd21-compare-popup__cta--filled js-click-feedback"
            href="${buyLink}"
            data-feedback-param="${utils.escapeHtml(item.feedbackParam)}"
            an-tr="pdd27_compare pop_up-${pageTrack}-buy now/pre-order-buy_cta2"
            an-ca="buy cta"
            an-ac="${ctaText}"
            an-la="product compare popup:${ctaText}"
            data-modelcode=${item.modelCode}
            data-modelname=${item.modelName}
          >
            ${utils.truncateText(ctaText, 24)}
          </a>
          `}
        </div>
        <div class="pd21-compare-popup__card-cta pd21-compare-popup__card-cta--secondary">
          <a 
            class="cta cta--underline-v2 cta--black pd21-compare-popup__cta--learn-more js-click-feedback"
            href="${learnMoreUrl}"
            data-feedback-param="${utils.escapeHtml(item.feedbackParam)}"
            aria-label="Learn more"
            an-tr="pdd27_compare pop_up-${pageTrack}-learn more click-product_click"
            an-ca="product click"
            an-ac="product compare popup"
            an-la="learn more click"
            data-modelcode=${item.modelCode}
            data-modelname=${item.modelName}
          >
            ${utils.truncateText("Learn more", 14)}
          </a>
        </div>
      </div>
      `;
    }

    function buildProductCard(item) {
      let pdpURL = item.pdpURL || item.consumerUrl;
      pdpURL = DOMAIN_NAME + pdpURL ?? '';

      return `
        ${productCardReviewsBuild(item)}
        ${productCardImageBuild(item)}
        <div style="overflow: hidden"></div>
        ${productCardFamilyOptionsBuild(item)}
        <div style="overflow: hidden"></div>
        ${productCardEnergyStarBuild(item)}
        <div class="pd21-compare-popup__card-divider"></div>
        <div style="overflow: hidden"></div>
        ${productCardPricingBuild(item)}
        <div style="overflow: hidden"></div>
        ${productCardCTABuild(item)}
      `
    }

    // Build spec table
    function buildSpecTable() {
      if (!specsData) {
        $('.pd21-compare-popup__filter-switch').hide();

        return `
        <div class="pd21-compare-popup__spec-table" role="table" aria-label="">
          <div class="pd21-compare-popup__spec-table-body" role="rowgroup"></div>
        </div>
        `;
      }

      const { compareSpecs, modelList } = specsData;

      if (compareSpecs.length > 0 && modelList.length > 0) {
        $('.pd21-compare-popup__filter-switch').show();
      } else {
        $('.pd21-compare-popup__filter-switch').hide();
      }

      const specRows = compareSpecs?.map(spec => {
        const values = modelList.map(model => {
          const specValue = model.specs.find(s => s.attrKey === spec.attrKey);
          return specValue?.attrValue || '';
        });

        // Check if values are different (for highlighting)
        const hasDifferences = new Set(values).size > 1;

        // Generate cells with conditional highlighting
        const cells = values.map((value, index) => {
          const content = hasDifferences
            ? `<mark class="pd21-compare-popup__spec-contents--highlight ${!value ? 'pd21-compare-popup__spec-contents--blank' : ''}">${utils.truncateText(value, 132)}</mark>`
            : utils.truncateText(value, 132);

          return `
            <li class="pd21-compare-popup__spec-contents" role="cell">
              ${content}
            </li>
          `;
        }).join('');

        // Build tooltip HTML if attrTooltip exists
        const tooltipHTML = spec.attrTooltip ? `
          <div class="pd21-compare-popup__spec-tooltip">
            <button type="button" class="pd21-compare-popup__spec-tooltip-open">
              <span class="hidden">Spec Tooltip Popup Open</span>
              <svg class="icon" viewBox="0 0 23 23">
                <path d="M9.845,24.574a11.266,11.266,0,1,1,12.334-2.418A11.256,11.256,0,0,1,9.845,24.574ZM4.979,14.206a9.25,9.25,0,1,0,17.8-3.538A9.093,9.093,0,0,0,17.767,5.66,9.25,9.25,0,0,0,4.979,14.206Zm8.25,6.75v-7.5h-1v-2h3v9.5Zm-.5-12.25a1.238,1.238,0,1,1,.363.887,1.25,1.25,0,0,1-.363-.887Z" transform="translate(-2.972 -2.942)" />
              </svg>
            </button>
            <div class="pd21-compare-popup__spec-tooltip-popup">
              <p class="pd21-compare-popup__spec-tooltip-desc">${utils.truncateText(spec.attrTooltip, 105)}</p>
              <button type="button" class="pd21-compare-popup__spec-tooltip-close">
                <span class="hidden">Spec Tooltip Popup Close</span>
                <svg class="icon" focusable="false" aria-hidden="true">
                  <use xlink:href="#cancel-close-regular" href="#cancel-close-regular"></use>
                </svg>
              </button>
            </div>
          </div>
        ` : '';

        return `
          <div class="pd21-compare-popup__spec-wrap">
            <div class="pd21-compare-popup__spec-title">
              <strong class="pd21-compare-popup__spec-title-text" role="rowheader">
                ${utils.truncateText(spec.attrName, spec.attrTooltip ? 72 : 78)}
              </strong>
              ${tooltipHTML}
            </div>
            <ul class="pd21-compare-popup__spec-row" role="row">
              ${cells}
            </ul>
          </div>
        `;
      }).join('');

      return `
    <div class="pd21-compare-popup__spec-table" role="table" aria-label="">
      <div class="pd21-compare-popup__spec-table-body" role="rowgroup">
        ${specRows}
      </div>
    </div>
  `;
    }

    async function fetchAndUpdateSpecs() {
      // const SKU1 = "SM-S721UZKEXAG";
      // const SKU2 = "SM-S937UZSEXAA";
      // const SKU3 = "SM-A166UZKAXAA";
      const currentModelCodes = localProductListData.map(product => product.modelCode);

      let modelList = currentModelCodes.join(',');

      if (!modelList) return;

      specsData = null;

      const $specTableContainer = $('.pd21-compare-popup__spec-table');
      const specTableHtml = `<div class="pd21-compare-popup__spec-table" role="table" aria-label="" style="height: 300px">
        <div class="pd21-compare-popup__spec-table-body" role="rowgroup"></div>
      </div>`;
      $specTableContainer.replaceWith(specTableHtml);

      $('.pd21-compare-popup__filter-switch').hide();
      window.sg.components.Pd21Modules.ComparePopup.initScroll();

      try {
        const { response } = await apis.getSpecsData(modelList);
        if (response?.statusCode == 200) {
          specsData = response.resultData;

          const specTableHtml = buildSpecTable();
          const $specTableContainer = $('.pd21-compare-popup__spec-table');
          if ($specTableContainer.length) {
            $specTableContainer.replaceWith(specTableHtml);
          }
        } else {
          console.error('Specs API error:', response?.statusMessage);
        }
      } catch (error) {
        console.error('Failed to fetch specs:', error);
      }

      window.sg.components.Pd21Modules.ComparePopup.reInit();
    }

    async function updateProductCard(cardIndex) {
      const item = {
        ...localProductListData[cardIndex],
        productIdx: cardIndex
      };

      updateCardContent(cardIndex, item);
      updateCardSku(cardIndex, item);
      updateCardTitle(cardIndex, item);
      updateCardFeatureTitle(cardIndex, item);
      alignElementsHeights();
      window.sg.components.Pd21Modules.ComparePopup.reInitTooltip();

      await fetchAndUpdateSpecs();
      window.sg.components.Pd21Modules.ComparePopup.handleDifferenceToggle();
    }

    function updateCardContent(cardIndex, item) {
      const $targetCard = $(`.pd21-compare-popup__card-item:eq(${cardIndex})`);

      if (!$targetCard.length) return;

      const updatedCardHtml = buildProductCard(item);
      $targetCard.html(updatedCardHtml);
      alignElementsHeights();

      const $mobileSelect = $targetCard.find('.pd21-compare-popup__card-mobile-option');
      if ($mobileSelect.length) {
        const totalOptions = $mobileSelect.find('option').length;
        const $cardOption = $mobileSelect.closest('.pd21-compare-popup__card-option');

        if (totalOptions === 1) {
          $cardOption.addClass('pd21-compare-popup__card-option--option-active');
        } else if (totalOptions > 1) {
          $cardOption.addClass('pd21-compare-popup__card-option--selector-active');
        }
      }

      if (window.sg.common.lazyLoad && $targetCard.length) {
        window.sg.common.lazyLoad.forceLoad($targetCard[0]);
      }
    }

    function updateCardSku(cardIndex, item) {
      const $skuItem = $(`.pd21-compare-popup__product-sku-item:eq(${cardIndex})`);

      if ($skuItem.length) {
        const skuText = utils.truncateText(item.modelCode, 35);
        $skuItem.find('.pd21-compare-popup__product-sku-name').text(skuText);
      }
    }

    function updateCardTitle(cardIndex, item) {
      const $titleItem = $(`.pd21-compare-popup__product-fixed-item:eq(${cardIndex})`);

      if ($titleItem.length) {

        let productName = getProductName(item);
        const titleText = utils.truncateText(productName, 39);
        $titleItem.find('.pd21-compare-popup__product-fixed-title').text(titleText);
      }
    }

    function updateCardFeatureTitle(cardIndex, item) {
      const productCardShortTitleTemplate = productCardShortTitleBuild(item);

      const $featureTitleWrap = $(`.pd21-compare-popup__feature-title-wrap`).children().eq(cardIndex);
      $featureTitleWrap.html(productCardShortTitleTemplate);
    }

    function handleCompareCardFocus(e) {
      const $focusedElement = $(e.target);
      const $card = $focusedElement.closest(e.data.targetEl);

      if (!$card.length) return;

      let scrollContainer = $('.pd21-compare-popup__horizontal-scrollbar .scrollbar__wrap')[0];

      if (!scrollContainer) return;

      const cardRect = $card[0].getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      const isNotFullyVisible = (
        cardRect.left < containerRect.left ||
        cardRect.right > containerRect.right
      );

      if (isNotFullyVisible) {
        const cardOffsetLeft = $card[0].offsetLeft;
        const cardWidth = $card[0].offsetWidth;
        const containerWidth = scrollContainer.clientWidth;
        const targetScroll = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);

        setTimeout(() => {
          scrollContainer.scrollLeft = targetScroll;
        }, 500);
      }
    }

    function attachProductCardEventListeners() {
      $('.pd21-compare-popup').off(".compareChip");
      $('.pd21-compare-popup').off(".compareCardFocus");

      const focusSelectors = [
        '.pd21-compare-popup__product-sku-item',
        '.pd21-compare-popup__product-fixed-title',
        '.pd21-compare-popup__feature-title-text',
        '.pd21-compare-popup__card-item',
        '.pd21-compare-popup__spec-contents',
      ];

      focusSelectors.forEach(selector => {
        $('.pd21-compare-popup')
          .on('click.compareCardFocus', selector, { targetEl: selector }, function (e) {
            handleCompareCardFocus(e);
          });
      });
      
      $('.pd21-compare-popup').on("click.compareChip", '.option-selector-v3__item:not(.is-disabled)', function (e) {
        const $el = $(this);

        if ($el.hasClass('is-disabled')) {
          return false;
        }

        const productIdx = parseInt($el.attr("data-productidx"));
        const chipCode = $el.attr("data-chip-code");
        const chipValue = $el.attr("data-chip-value");
        const modelCode = $el.attr("data-modeli");
        const chipType = $el.attr("data-chip-type");

        let updatedResponse = [...localChipBinderData];

        updatedResponse[productIdx].chipOptions.forEach((chipOption) => {
          if ((chipOption.optionNameEng).toLowerCase() == chipType.toLowerCase()) {
            chipOption.optionValues = chipOption.optionValues.map(
              (option) => {
                return {
                  ...option,
                  checked: (chipType.toLowerCase() == 'color'
                    ? (option.optionCode === chipCode && option.optionValue === chipValue)
                    : option.optionValue.toLowerCase().replace(/"/ig, "") == chipCode),
                }
              }
            );
          }
        });

        const otherChipData = localChipBinderData[productIdx].chipOptions?.filter(el => {
          const name = el.optionNameEng?.toLowerCase();
          return chipType.toLowerCase() === "color" ? name !== "color" : name === "color";
        });

        const collectedMappers = [];

        const updatedSelectedChip = updatedResponse[productIdx].chipOptions?.filter(
          (el) => (chipType.toLowerCase() == 'color'
            ? el.optionNameEng.toLowerCase() == "color"
            : el.optionNameEng.toLowerCase() !== "color")
        );

        updatedSelectedChip.forEach((updatedSelectedChipElem) => {
          updatedSelectedChipElem.optionValues.map((option) => {
            if (option.checked) {
              collectedMappers.push(option.optionValue);
            }
          });
        });

        if (chipType.toLowerCase() == 'color') {
          otherChipData.forEach((otherChipDataOption) => {
            otherChipDataOption.optionValues.map((option) => {
              if (option.checked) {
                collectedMappers.push(option.optionValue);
              }
            });
          });
        } else {
          otherChipData[0]?.optionValues.map((el) => {
            if (el.checked) {
              collectedMappers.push(el.optionValue);
            }
          });
        }

        const clickedProductIs = localChipBinderData[productIdx];

        const matchingParent = clickedProductIs.groupedProductList.find(
          (obj) =>
            collectedMappers.every((mapper) => {
              return obj.chips.some((chipElement) => {
                return chipElement.fmyChipName == mapper;
              });
            })
        );

        if (matchingParent) {
          localProductListData[productIdx] = {
            ...localProductListData[productIdx],
            ...matchingParent
          };

          updatedResponse[productIdx].chipOptions = utils.updateDisabledFlag(
            updatedResponse[productIdx].chipOptions
          );

          localChipBinderData[productIdx] = {
            ...localChipBinderData[productIdx],
            ...updatedResponse[productIdx]
          };

          requestAnimationFrame(() => {
            updateProductCard(productIdx);
          });
        }
      });

      $('.pd21-compare-popup').on("change.compareChip", '.pd21-compare-popup__card-mobile-option', function (e) {
        const $selectedOption = $(this).find('option:selected');
        $selectedOption.trigger('click.compareChip');
      });

      $('.pd21-compare-popup').off('click.feedbackAPI');
      $('.pd21-compare-popup').on('click.feedbackAPI', '.pd21-compare-popup__card-item .js-click-feedback', function (e) {
        const feedbackParam = $(this).data('feedback-param');
        apis.clickFeedbackAPI(feedbackParam);
      });

      $('.pd21-compare-popup').off('mouseenter.ratingTooltipButton click.ratingTooltipButton');

      const handleCompareRating = function (e) {
        const $optionInputEl = $(this);
        let modelCode = $optionInputEl.attr("data-modelCode");
        if ($optionInputEl.find(".pd21-tooltip__rating-list .pd21-tooltip__rating-item").length <= 0) {
          utils.reviewRatingLayer(modelCode, $optionInputEl);
        };
      };

      const supportsHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      if (supportsHover) {
        $('.pd21-compare-popup').on('mouseenter.ratingTooltipButton', '.pd21-compare-popup__card-item .pd21-tooltip__container--rating button', handleCompareRating);
      } else {
        $('.pd21-compare-popup').on('click.ratingTooltipButton', '.pd21-compare-popup__card-item .pd21-tooltip__container--rating button', handleCompareRating);
      }
    }

    function buildComparePopupHTML() {
      let cardItemSkuHtml = '';
      let cardItemNameHtml = '';
      let cartShortTitleHtml = '';
      let cardGridHtml = '';

      // Filter chipBinderData of selected products only
      let data = state.compareSelectedItems.map((selectedItem, i) => {
        return {
          ...localProductListData[i],
          productIdx: i,
        }
      });

      for (let i = 0; i < data.length; i++) {
        const item = data[i];

        cardItemSkuHtml += productCardModelCodeBuild(item.modelCode);
        cardItemNameHtml += productCardModelNameBuild(item);
        cartShortTitleHtml += productCardShortTitleBuild(item);
        cardGridHtml += `
      <li class="pd21-compare-popup__card-item">
        ${buildProductCard(item)}
      </li>
    `;
      }

      // Build spec table
      const specTableHtml = buildSpecTable();

      // Combine everything
      return `
    <div class="pd21-compare-popup__container scrollbar__contents">
      <div class="pd21-compare-popup__product-sku">
        <ul class="pd21-compare-popup__product-sku-list">
          ${cardItemSkuHtml}
        </ul>
      </div>

      <div class="pd21-compare-popup__product-fixed">
        <ul class="pd21-compare-popup__product-fixed-list">
          ${cardItemNameHtml}
        </ul>
      </div>

      <div class="pd21-compare-popup__feature-title-wrap">
        ${cartShortTitleHtml}
      </div>

      <div class="pd21-compare-popup__product-wrap">
        <ul class="pd21-compare-popup__product-list" role="list">
          ${cardGridHtml}
        </ul>

        <div class="pd21-compare-popup__filter-switch">
          <div class="switch-v2">
            <button 
              class="switch-v2__button"
              an-tr="pdd27_compare pop_up-${pageTrack}-radio button-content_click"
              an-ca="content click"
              an-ac="feature"
              an-la="product compare popup:compare"
            >
              <span class="switch-v2__button-track-wrap">
                <span class="switch-v2__button-track"></span>
                <span class="switch-v2__button-thumb-wrap">
                  <span class="switch-v2__button-thumb"></span>
                </span>
              </span>
              <span class="switch-v2__button-text-on">Show me only the differences</span>
              <span class="switch-v2__button-text-off">${utils.truncateText("Show me only the differences", 49)}</span>
            </button>
          </div>
        </div>

        ${specTableHtml}
      </div>
    </div>
  `;
    }

    async function render(productListData, chipBinderData) {
      localProductListData = state.compareSelectedItems.map(item => utils.deepClone(item.productData));
      localChipBinderData = state.compareSelectedItems.map(item => utils.deepClone(item.productData));

      const compareSelectedItems = state.compareSelectedItems;

      const $comparePopupContainer = $(".pd21-compare-popup__container");
      if ($comparePopupContainer.length) {
        const compareHTML = buildComparePopupHTML();
        $comparePopupContainer.html(compareHTML);
        alignElementsHeights();

        $(".pd21-compare-popup__headline").text(utils.truncateText("Compare models", 35));
        $(".pd21-compare-popup__description").text(utils.truncateText("Compare features most relevant for you.", 57));

        const $comparePopup = $(".pd21-compare-popup");

        if (compareSelectedItems.length === 2) {
          $comparePopup.addClass("pd21-compare-popup--item2");
        } else {
          $comparePopup.removeClass("pd21-compare-popup--item2");
        }
        window.sg.components.Pd21Modules.ComparePopup.showPopup();
        window.sg.components.Pd21Modules.ComparePopup.reInit();

        // Attach event listeners
        attachProductCardEventListeners();

        fetchAndUpdateSpecs();
        window.sg.components.Pd21Modules.ComparePopup.handleDifferenceToggle();
      }
    }

    return {
      render: render,
    };
  })($);

  // Attach to pd21Modules
  pd21Modules.ComparePopupComponent = ComparePopupComponent;

})(window.jQuery);
(function ($) {
  "use strict";

  const $q = window.sg.common.$q;

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;
  const utils = pd21Modules.Utils;
  const comparePopupComponent = pd21Modules.ComparePopupComponent;
  const confirmPopup = pd21Modules.ConfirmPopup;

	const pageTrack = $("#pfPageTrack").val();

  function createItemHTML(compareModelListItem) {
    if (compareModelListItem) {
      return `
        <li class="pd21-compare-bar__item pd21-compare-bar__item--active" data-model-code="${compareModelListItem.modelCode}">
          <!--/* [D] image preset : preview(LazyLoad_Home), PC(56_56), MO(92_92) */-->
          <div class="image">
            <img class="image__preview lazy-load responsive-img" data-desktop-src="${compareModelListItem.imgSrc}"
              data-mobile-src="${compareModelListItem.imgSrc}" alt="alt text" role="img" data-comp-name="image">
            <img class="image__main responsive-img lazy-load" data-desktop-src="${compareModelListItem.imgSrc}"
              data-mobile-src="${compareModelListItem.imgSrc}" alt="alt text" role="img" data-comp-name="image">
          </div>
          <button class="pd21-compare-bar__item-close" js-data-action="pd21CompareBarItemClose" an-tr="pd21_product finder / filter-${pageTrack}-compare-content_click" an-ca="content click" an-ac="feature" an-la="product finder:compare:delete">
            <span class="hidden">close</span>
            <svg class="icon" focusable="false">
              <use xlink:href="#cancel-close-regular" href="#cancel-close-regular"></use>
            </svg>
          </button>
        </li>`;
    } else {
      return `
        <li class="pd21-compare-bar__item">
          <!--/* [D] image preset : preview(LazyLoad_Home), PC(56_56), MO(92_92) */-->
          <div class="image">
            <img class="image__preview lazy-load responsive-img" data-desktop-src="https://placehold.co/72x72/png" data-mobile-src="https://placehold.co/144x144/png" alt="alt text" role="img" data-comp-name="image">
            <img class="image__main responsive-img lazy-load" data-desktop-src="https://placehold.co/72x72/png" data-mobile-src="https://placehold.co/144x144/png" alt="alt text" role="img" data-comp-name="image">
          </div>
          <button class="pd21-compare-bar__item-close" js-data-action="pd21CompareBarItemClose">
            <span class="hidden">close</span>
            <svg class="icon" focusable="false">
              <use xlink:href="#cancel-close-regular" href="#cancel-close-regular"></use>
            </svg>
          </button>
        </li>`;
    }
  }

  function updateCompareBar(action, targetModelCode) {
    const $compareBarList = $(".pd21-compare-bar__list");

    if (!$compareBarList.length) return;

    if (action === 'add') {
      const newItemIndex = state.compareSelectedItems.length - 1;
      const $items = $compareBarList.find(".pd21-compare-bar__item");
      const $targetItem = $items.eq(newItemIndex);

      if ($targetItem.length) {
        const compareModelListItem = state.compareSelectedItems[newItemIndex];
        const newItemHTML = createItemHTML(compareModelListItem);

        $targetItem.replaceWith(newItemHTML);

        const $newItem = $compareBarList.find(".pd21-compare-bar__item").eq(newItemIndex);
        if (window.sg.common.lazyLoad && $newItem.length) {
          window.sg.common.lazyLoad.forceLoad($newItem[0]);
        }
      }
    } else if (action === 'remove') {
      const $items = $compareBarList.find(".pd21-compare-bar__item");

      if (targetModelCode) {
        let removedIndex = -1;

        $items.each(function (index) {
          if ($(this).attr('data-model-code') === targetModelCode) {
            removedIndex = index;
            return false;
          }
        });

        if (removedIndex !== -1) {
          $items.each(function (index) {
            if (index >= removedIndex) {
              const $item = $(this);
              const compareModelListItem = state.compareSelectedItems[index] || null;
              const newItemHTML = createItemHTML(compareModelListItem);

              $item.replaceWith(newItemHTML);

              const $newItem = $compareBarList.find(".pd21-compare-bar__item").eq(index);
              if (window.sg.common.lazyLoad && $newItem.length) {
                window.sg.common.lazyLoad.forceLoad($newItem[0]);
              }
            }
          });
        }
      } else {
        let template = "";

        $items.each(function (index) {
          const compareModelListItem = state.compareSelectedItems[index];
          template += createItemHTML(compareModelListItem);
        });

        $compareBarList.html(template);

        if (window.sg.common.lazyLoad) {
          window.sg.common.lazyLoad.forceLoad($compareBarList[0]);
        }
      }
    }

    const $compareBarTitleResult = $(".pd21-compare-bar__title-result");
    if ($compareBarTitleResult.length) {
      let count = String(state.compareSelectedItems.length);
      count = utils.truncateText(count, state.isMobile ? 15 : 16);
      $compareBarTitleResult.html(`(${count})`);
    }

    const $compareCTA = $(".pd21-compare-bar__cta");
    if ($compareCTA.length) {
      if (state.compareSelectedItems.length >= 2) {
        $compareCTA.prop("disabled", false);
        $compareCTA.removeClass("cta--disabled");
      } else {
        $compareCTA.prop("disabled", true);
        $compareCTA.addClass("cta--disabled");
      }

      const modelCodes = state.compareSelectedItems.map(item => item.modelCode).join(',')
      const modelNames = state.compareSelectedItems.map(item => item.modelName).join(',')
      $compareCTA.attr({
        'data-modelcode': `${modelCodes}`,
        'data-modelname': `${modelNames}`,
      });
    }

    // If all products removed, close compare bar
    if (state.compareSelectedItems.length === 0) {
      const $compareBar = $(".pd21-compare-bar");
      if ($compareBar.hasClass("pd21-compare-bar--show")) {
        $compareBar.removeClass("pd21-compare-bar--show");
      }
    }
  }

  function productCompareSelectHandler(compareCheckbox) {
    const $compareCheckbox = $(compareCheckbox);

    // Cannot select more than 3 products to compare
    if (state.compareSelectedItems.length >= 3) {
      $compareCheckbox.prop("checked", false);
      confirmPopup?.showPopup();
      return;
    }

    const modelCode = $compareCheckbox.attr("data-model-code");
    const modelName = $compareCheckbox.attr("data-modelname");
    const groupId = $compareCheckbox.attr("data-group-id");
    const productIdx = $compareCheckbox.attr("data-productidx");

    // Check for duplicate model code
    const isDuplicate = state.compareSelectedItems.some(function (item) {
      return item.modelCode === modelCode;
    });

    if (isDuplicate) {
      $compareCheckbox.prop("checked", false);
      return;
    }

    const imgSrc = $compareCheckbox.attr("data-img-src");
    const productData = utils.deepClone(state.productListData).find(list => list.modelCode === modelCode);

    if (productData) {
      state.compareSelectedItems.push({
        modelCode,        // Used as unique ID
        modelName,
        groupId,
        productData,
        imgSrc,
      });
    }

    updateCompareBar('add');
    window.sg.components.Pd21ProductFinder.showCompareBar();
  }

  function productCompareRemoveHandler(modelCode) {
    // Find and remove from array using modelCode
    for (let i = 0; i < state.compareSelectedItems.length; i++) {
      if (state.compareSelectedItems[i].modelCode === modelCode) {
        // Remove from array
        state.compareSelectedItems.splice(i, 1);

        // Uncheck the corresponding product card checkbox using modelCode
        const $checkbox = $('.pd21-product-card__compare-checkbox[data-model-code="' + modelCode + '"]');
        if ($checkbox.length) {
          $checkbox.prop("checked", false);
        }
        
        updateCompareBar('remove', modelCode);
        break;
      }
    }
  }

  function initCompare() {
    // Change Event Delegation - For Product Cards
    const $productCardsRoot = $(".pd21-product-card");
    if ($productCardsRoot.length && !$productCardsRoot.data('hasChangeListener')) {
      $productCardsRoot.data('hasChangeListener', true);

      $productCardsRoot.on('change.compareBar-checkbox', '.pd21-product-card__compare-checkbox', function (e) {
        const $productCompareCheckbox = $(this);

        if ($productCompareCheckbox.prop("checked")) {
          productCompareSelectHandler($productCompareCheckbox[0]);
          return;
        } else {
          const modelCode = $productCompareCheckbox.attr("data-model-code");
          if (!modelCode) return;

          productCompareRemoveHandler(modelCode);
          return;
        }
      });
    }

    // Click Event Delegation - For Compare Bar
    const $compareBarRoot = $(".pd21-compare-bar");
    if ($compareBarRoot.length && !$compareBarRoot.data('hasClickListener')) {
      $compareBarRoot.data('hasClickListener', true);

      $compareBarRoot.on('click.compareBar', function (e) {
        const $target = $(e.target);

        // Compare bar selected item remove handler
        const $compareRemoveBtn = $target.closest(".pd21-compare-bar__item-close");

        if ($compareRemoveBtn.length) {
          const $compareRemoveItem = $compareRemoveBtn.closest(".pd21-compare-bar__item--active");
          if (!$compareRemoveItem.length) return;

          const modelCode = $compareRemoveItem.attr("data-model-code");
          if (!modelCode) return;

          productCompareRemoveHandler(modelCode);
          return;
        }

        // Compare bar close handler
        const $compareBarCloseBtn = $target.closest(".pd21-compare-bar__close");
        if ($compareBarCloseBtn.length) {
          const checkedModelCodes = state.compareSelectedItems.map(function (item) {
            return item.modelCode;
          });

          $.each(checkedModelCodes, function (index, modelCode) {
            const $checkbox = $('.pd21-product-card__compare-checkbox[data-model-code="' + modelCode + '"]');
            if ($checkbox.length && $checkbox.prop("checked")) {
              $checkbox.prop("checked", false);
            }
          });

          state.compareSelectedItems = [];

          updateCompareBar('remove');
          return;
        }

        // Compare bar Compare CTA handler
        const $comparCTA = $target.closest(".pd21-compare-bar__cta");
        if ($comparCTA.length) {
          comparePopupComponent.render(state.productListData, state.chipBinderData);
        }
      });
    }
  }

  $(function () {
    initCompare();
  });

  pd21Modules.CompareBar = {
    productCompareRemoveHandler: productCompareRemoveHandler,
  };

})(window.jQuery);
(() => {
  const $q = window.sg.common.$q;
  const KEY_CODE = window.sg.common.constants.KEY_CODE;
  const utils = window.sg.common.utils;
  const swiperManager = window.sg.common.swiperManager;
  const lazyLoad = window.sg.common.lazyLoad;
  const optionSelectorV2 = window.sg.common.optionSelectorV2;
  const textFieldv2 = window.sg.common.textFieldv2;

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;
  const { truncateText } = pd21Modules.Utils;

  const selector = {
    section: '.pd21-product-finder',
  };

 class Pd21ProductFinder {
    constructor(element) {
      this.selector = {
        // Common
        comboArrowPrev: '.arrow-indicator--prev',
        comboArrowNext: '.arrow-indicator--next',
        // Top heder
        topWrap: '.pd21-top',
        topHeader: '.pd21-top__header',
        // Filter
        filter: '.pd21-filter',
        filterScrollArea: '.pd21-filter__filter',
        filterInner: '.pd21-filter__filter-inner',
        filterMoCTA: '.pd21-filter__mo-cta',
        fitlerSelectorList: '.pd21-filter__selector-list',
        filterSelectorItem: '.pd21-filter__selector-item',
        filterSelectorItemMenu: '.pd21-filter__selector-item--menu',
        filterSelectorShow: '.pd21-filter__selector-item--show',
        filterOption: '.pd21-filter__option',
        filterOptionList: '.pd21-filter__option-list',
        filterOptionViewMoreCTA: '.pd21-filter__selector-view-more',
        filterSelectorItemButton: 'button.pd21-filter__selector-item-cta',
        mobileFilterApplyCTA: '.pd21-filter__mo-cta .cta.cta--contained.cta--black',
        mobileFilterClearAllCTA: '.pd21-filter__clear--mo',
        fiterChipList: '.pd21-filter__selected-list',
        filterChipItem: '.pd21-filter__selected-item',
        filterChipViewCTA: '.pd21-filter__selected-view-more',
        mobileFilterOpenCTA: '[data-js-action="pd21MoFilterOpen"]',
        mobileFilterCloseCTA: '[data-js-action="pd21MoFilterClose"]',
        filterTooltipWrap: '.pd21-filter__tooltip',
        filterTooltipContent: '.pd21-filter__tooltip-content',
        filterTooltipContentClone: '.pd21-filter > .pd21-filter__tooltip-content',
        filterTooltipText: '.pd21-filter__tooltip-text',
        filterTooltipOpen: '[data-js-action="pd21TooltipOpen"]',
        filterTooltipClose: '[data-js-action="pd21TooltipClose"]',
        filterTextfieldCta: '[data-js-action="pd21ToggleOptions"]',
        filterTextField: '.pd21-filter__text-field',
        // Sort
        sort: '.pd21-sort',
        sortOpen: '[js-data-action="pd21SortToggle"]',
        sortClose: '[js-data-action="pd21SortClose"]',
        sortContents: '.pd21-sort__contents',
        sortHeadName: '.pd21-sort__contents-head-name',
        sortItemInput: '.radio-v3__input',
        sortSelectedItem: '.radio-v3:has(.radio-v3__input:checked)',
        sortSelectedName: '.pd21-sort__opener-name',
        mobileSortCloseButton: '[js-data-action="pd21SortClose"]',
        sortApply: '.pd21-sort__contents-bottom .cta',
        // Compare Bar
        compareBar: '.pd21-compare-bar',
        compareBarToggle: '[data-js-action="pd21CompareBarToggle"]',
        compareBarCTA: '.pd21-compare-bar__cta',
        compareBarClose: '[js-data-action="pd21CompareBarClose"]',
        compareBarItem: '.pd21-compare-bar__item',
        compareBarActiveItem: '.pd21-compare-bar__item--active',
        // Card
        cardsList: '.pd21-product-card',
        cards: '.pd21-product-card__item',
        cardsOptions: '.pd21-product-card__options',
        cardsOptionsTooltip: '.pd21-product-card__options-tooltip',
        cardsColorChipText: '.option-selector-v2__color-name',
        cardsTooltipClose: '.pd21-product-card__options-tooltip-close',
        cardsComboSwiper: '.pd21-product-card__combo-wrap',
        cardsComboSlide: '.pd21-product-card__combo',
        cardsImage: '.pd21-product-card__image',
        cardsImageCTA: '.pd21-product-card__image-cta',
        cardsImageWrap: '.pd21-product-card__image-wrap',
        cardsName: '.pd21-product-card__name',
        cardsRating: '.pd21-product-card__rating',
        cardsBanner: '.pd21-product-card__banner',
        tooltip: '[data-js-action="pd21TooltipContainer"]',
        tooltipLayer: '[data-js-action="pd21TooltipLayer"]',
        tooltipShow: '[data-js-action="pd21TooltipShow"]',
        tooltipHide: '[data-js-action="pd21TooltipHide"]',
        tooltipHover: 'data-tooltip-hover',
        sameHeight: [
          '.pd21-product-card__name-wrap',
          '.pd21-product-card__rating',
          '.pd21-product-card__feature-title-wrap',
          '.pd21-product-card__options',
          '.pd21-product-card__fiche-wrap',
          '.pd21-product-card__delivery-wrap',
          '.pd21-product-card__energy-star-label-wrap',
          '.pd21-product-card__price',
          '.pd21-product-card__seller',
          '.pd21-product-card__cta-wrap',
        ],
        // Quick view
        quickView: '.pd21-quick-view',
        quickViewClose: '.pd21-quick-view__close',
        quickViewImage: '.pd21-quick-view__gallery',
        quickViewImageSlide: '.pd21-quick-view__gallery-item',
        quickViewVideoBtn: '.pd21-quick-view__video-play-btn',
        quickViewVideoPlay: '.pd21-quick-view__gallery-item--video-play',
        quickViewFiche: '.pd21-quick-view__fiche',
        quickViewCombo: '.pd21-quick-view__combo-wrap',
        quickViewComboSlide: '.pd21-quick-view__combo',
      };

      this.classes = {
        finderOnScreenClass: 'pd21-product-finder--on-screen',
        // Top header
        topHeaderHide: 'pd21-top__header--hide',
        // Filter
        filter: 'pd21-filter',
        filterHide: 'pd21-filter--hide',
        filterClose: 'pd21-filter--close',
        mobileFilterShowClass: 'pd21-filter--show',
        mobileFilterOpenClass: 'pd21-filter--open',
        filterSelectorShowClass: 'pd21-filter__selector-item--show',
        filterSelectorOpenClass: 'pd21-filter__selector-item--open',
        filterOptionViewMoreClass: 'pd21-filter__selector-item--view-more',
        filterChipViewMoreClass: 'pd21-filter__selected-list--view-more',
        filterChipViewCTAHide: 'pd21-filter__selected-view-more--hide',
        filterOptionOffScreen: 'pd21-filter__selector-item--off-screen',
        filterTooltipShow: 'pd21-filter__tooltip-content--show',
        filterTooltipMouseEnter: 'pd21-filter__tooltip-content--mouse-enter',
        // Sort
        sortContents: 'pd21-sort__contents',
        sortShowClass: 'pd21-sort__contents--show',
        sortOpenClass: 'pd21-sort__contents--open',
        // Compare Bar
        compareBarShow: 'pd21-compare-bar--show',
        compareBarToggleClass: 'pd21-compare-bar--toggle',
        compareBarActiveItemClass: 'pd21-compare-bar__item--active',
        // Card
        cardsBannerClass: 'pd21-product-card__banner',
        cardActive: 'pd21-product-card__item--active',
        cardTooltipShow: 'option-selector-v2__color-name--tooltip-show',
        cardTitleOverflow: 'pd21-product-card__name--tooltip',
        // Quick View
        quickView: 'pd21-quick-view',
        quickViewShow: 'pd21-quick-view--show',
        quickViewOpen: 'pd21-quick-view--open',
        quickViewVideoPlayClass: 'pd21-quick-view__gallery-item--video-play',
        quickViewScrollClass: 'pd21-quick-view--scroll',
        quickViewScrollbar: 'pd21-quick-view__scrollbar'
      };

      this.el = {
        section: $q(element),
        window: $q(window),
      };

      this.handler = {
        // Filter
        handleClickFilterSelectorItem: this.handleClickFilterSelectorItem.bind(this),
        handleClickMobileFilterHide: this.handleClickMobileFilterHide.bind(this),
        handleClickOptionViewMore: this.handleClickFilterOptionViewMore.bind(this),
        handleClickFilterChipViewMore: this.handleClickFilterChipViewMore.bind(this),
        handleTransitionEndFilterOption: this.handleTransitionEndFilterOption.bind(this),
        handleFilterTooltipOpen: this.handleFilterTooltipOpen.bind(this),
        handleFilterTooltipClose: this.handleFilterTooltipClose.bind(this),
        // Sort
        handleClickSortOpen: this.handleClickSortOpen.bind(this),
        handleClickSortClose: this.handleClickSortClose.bind(this),
        handleChangeSortItem: this.handleChangeSortItem.bind(this),
        handleClickSortApply: this.handleClickSortApply.bind(this),
        handleKeyDownSortItem: this.handleKeyDownSortItem.bind(this),
        // Compare Bar
        handleClickCompareBarToggle: this.handleClickCompareBarToggle.bind(this),
        handleClickComparebarClose: this.handleClickComparebarClose.bind(this),
        // Common
        handleResize: this.handleResize.bind(this),
        handleScroll: this.handleScroll.bind(this),
        handleUserScroll: this.handleUserScroll.bind(this),
        handleMouseEnterCard: this.handleMouseEnterCard.bind(this),
        handleMouseLeaveCard: this.handleMouseLeaveCard.bind(this),
        handleMouseEnterColorTooltip: this.handleMouseEnterColorTooltip.bind(this),
        handleClickWindow: this.handleClickWindow.bind(this),
        handleFocusOutTarget: this.handleFocusOutTarget.bind(this),
        // Product card
        handleTooltipOpen: this.handleTooltipOpen.bind(this),
        handleTooltipClose: this.handleTooltipClose.bind(this),
        // Quick view
        handleClickQuickViewClose: this.handleClickQuickViewClose.bind(this),
        handleMouseDownQuickViewClose: this.handleMouseDownQuickViewClose.bind(this),
        handleMouseUpQuickViewClose: this.handleMouseUpQuickViewClose.bind(this),
        handleResizeQuickView: this.handleResizeQuickView.bind(this),
        handleClickVideoPlay: this.handleClickVideoPlay.bind(this),
        handleScrollQuickView: this.handleScrollQuickView.bind(this),
      };

      this.currentDevice = utils.getCurrentDevice();
      this.scrollY = window.scrollY;
      this.prevSortedItem;
      this.imageMoveTimer;
      this.scrollTimer;
      this.focusTargetEl;
      this.isTargetQuickView;
      this.wasFullScreen;
      this.isCardImageTransform = false;
      this.directionFlag = utils.getDirection();
      this.componentTop = this.el.section.offset().top;
      this.comboSwiperInstances = new WeakMap();
      this.imageSwiperInstances = new WeakMap();
      this.lastWindowWidth = window.innerWidth;

      this.init();

      Pd21ProductFinder.instances.set(element, this);
    }

    init() {
      this.setElements();
      this.updateStickyHeights();
      this.setupStickyObservers();
      this.reInitCards();
      this.reInitFilter();
      this.reInitSort();
      this.reInitCompareBar();
      this.reInitQuickView();
      this.reInitTooltip();
      this.bindEvents();
      if (this.currentDevice === 'mobile') {
        this.setCardImageSwiper();
      }
    }

    reInit() {
      this.init();
    }

    setElements() {
      this.el.top = this.el.section.find(this.selector.topWrap);
      this.el.topHeader = this.el.section.find(this.selector.topHeader);
    }

    bindEvents() {
      this.el.window.off('resize',this.handler.handleResize).on('resize',this.handler.handleResize);
      this.el.window.off('deviceorientation',this.handler.handleResize).on('deviceorientation',this.handler.handleResize);
      this.el.window.off('scroll',this.handler.handleScroll).on('scroll',this.handler.handleScroll);
      this.el.window.off('wheel',this.handler.handleUserScroll).on('wheel',this.handler.handleUserScroll);
      this.el.window.off('touchmove', this.handler.handleUserScroll).on('touchmove', this.handler.handleUserScroll);

      window.dispatchEvent(new Event('resize'));
    }

    handleResize() {
      if (window.innerWidth === this.lastWindowWidth) return;
      this.lastWindowWidth = window.innerWidth;

      const currentDevice = utils.getCurrentDevice();

      // this.setCardHeight();
      this.updateStickyHeights();
      this.setFilterItemHeight();
      this.handleFilterTooltipClose();
      requestAnimationFrame(() => this.setFilterListPosition());

      if( this.currentDevice !== currentDevice ) {
        setTimeout(() => {
          this.setOnScreen();
          this.el.cards.removeClass(this.classes.cardActive);
          this.setFilterResponsive();
          this.setFilterTooltip();
          this.closeExpandedFilter();
          this.hideMobileFilter();
          this.hideSortContets();
          this.checkActiveSort();
          this.setCardTitleOverflow();
          // this.setBannerCardPosition();
          this.setActiveCard();
          utils.removeMobileFocusLoop();
          this.el.section.offLayerFocus();

          if (currentDevice === 'mobile') {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                this.setCardImageSwiper();
              });
            });
          } else {
            this.destroyCardImageSwipers();
          }
        }, 20);
      }

      this.currentDevice = currentDevice;
      state.isMobile = currentDevice === "mobile";

      requestAnimationFrame(() => {
        if (window.sg.components.Pd21ProductCard.alignCardHeights) {
          window.sg.components.Pd21ProductCard.alignCardHeights();
        }
      });

      if (window.sg.components.Pd21ProductCard.productCardEventListener) {
        window.sg.components.Pd21ProductCard.productCardEventListener();
      }
    }

    handleScroll() {
      if(state.preventAutoScroll) return;

      const currentScrollY = window.scrollY;
      if(this.scrollTimer) clearTimeout(this.scrollTimer);

      this.setOnScreen();
      this.setFilterVisible(currentScrollY);
      this.setTopHeaderVisible(currentScrollY);
      this.handleFilterTooltipClose();
      this.updateStickyHeights();

      this.scrollTimer = setTimeout(() => {
        this.setActiveCard();
      }, 20);

      this.scrollY = currentScrollY;
    }

    handleUserScroll() {
      if(state.preventAutoScroll) {
        state.preventAutoScroll = false;
      }
    }

    handleClickWindow(e) {
      if(this.currentDevice === 'mobile') {
        const target = $q(e.target);

        if(target.hasClass(this.classes.filter) || target.hasClass(this.classes.sortContents)) {
          this.hideMobileFilter();
          this.hideSortContets();
        }
      } else {
        if( !(e.target.closest(`.${this.classes.filterSelectorOpenClass}`) || e.target.closest(this.selector.sortOpen) || e.target.closest(`.${this.classes.sortOpenClass}`))) {
          this.closeExpandedFilter();
          this.hideSortContets();
        }
      }
    }

    handleFocusOutTarget(e) {
      if(this.currentDevice === 'desktop') {
        if( e.target.closest(`.${this.classes.filterSelectorOpenClass}`) || e.target.closest(this.selector.sortOpen) || e.target.closest(`.${this.classes.sortOpenClass}`)) return;
        this.closeExpandedFilter();
        this.hideSortContets();
      }
    }

    setTopHeaderVisible(currentScrollY) {
      if(currentScrollY > this.scrollY) {
        this.el.topHeader.addClass(this.classes.topHeaderHide);
      } else {
        this.el.topHeader.removeClass(this.classes.topHeaderHide);
      }
    }

    setAccessibility(el, focusable = true) {
      if(focusable) {
        el.removeAttr('tabindex');
        el.removeAttr('aria-hidden');
      } else {
        el.attr('tabindex', -1);
        el.attr('aria-hidden', true);
      }
    }

    setOnScreen() {
      this.componentTop = this.el.section.offset().top;

      if(this.componentTop < -100) {
        this.el.section.addClass(this.classes.finderOnScreenClass);
      } else {
        this.el.section.removeClass(this.classes.finderOnScreenClass);
      }
    }

    // filter
    reInitFilter() {
      this.el.filter = this.el.section.find(this.selector.filter);
      this.el.filterScrollArea = this.el.section.find(this.selector.filterScrollArea);
      this.el.filterInner = this.el.section.find(this.selector.filterInner);
      this.el.fitlerSelectorList = this.el.filter.find(this.selector.fitlerSelectorList);
      this.el.filterSelectorItem = this.el.filter.find(this.selector.filterSelectorItem);
      this.el.filterSelectorItemMenu = this.el.filter.find(this.selector.filterSelectorItemMenu);
      this.el.filterSelectorItemButton = this.el.filter.find(this.selector.filterSelectorItemButton);
      this.el.filterOption = this.el.section.find(this.selector.filterOption);
      this.el.filterOptionList = this.el.section.find(this.selector.filterOptionList);
      this.el.filterOptionViewMoreCTA = this.el.section.find(this.selector.filterOptionViewMoreCTA);
      this.el.fiterChipList = this.el.section.find(this.selector.fiterChipList);
      this.el.filterChipViewCTA = this.el.section.find(this.selector.filterChipViewCTA);
      this.el.mobileFilterOpenCTA = this.el.section.find(this.selector.mobileFilterOpenCTA);
      this.el.mobileFilterCloseCTA = this.el.section.find(this.selector.mobileFilterCloseCTA);
      this.el.mobileFilterApplyCTA = this.el.section.find(this.selector.mobileFilterApplyCTA);
      this.el.mobileFilterClearAllCTA = this.el.section.find(this.selector.mobileFilterClearAllCTA);
      this.el.filterTooltipText = this.el.section.find(this.selector.filterTooltipText);
      this.el.filterTooltipOpen = this.el.section.find(this.selector.filterTooltipOpen);
      this.el.filterTooltipClose = this.el.section.find(this.selector.filterTooltipClose);
      this.el.filterTextfieldCta = this.el.section.find(this.selector.filterTextfieldCta);
      this.el.filterTextField = this.el.section.find(this.selector.filterTextField);
      this.el.filterSelectorItemButton.off('click', this.handler.handleClickFilterSelectorItem).on('click', this.handler.handleClickFilterSelectorItem);
      this.el.mobileFilterCloseCTA.off('click', this.handler.handleClickMobileFilterHide).on('click', this.handler.handleClickMobileFilterHide);
      this.el.mobileFilterApplyCTA.off('click', this.handler.handleClickMobileFilterHide).on('click', this.handler.handleClickMobileFilterHide);
      // this.el.mobileFilterClearAllCTA.off('click', this.handler.handleClickMobileFilterHide).on('click', this.handler.handleClickMobileFilterHide);
      this.el.filterOptionViewMoreCTA.off('click', this.handler.handleClickOptionViewMore).on('click', this.handler.handleClickOptionViewMore);
      this.el.filterChipViewCTA.off('click', this.handler.handleClickFilterChipViewMore).on('click', this.handler.handleClickFilterChipViewMore);
      // this.el.filterTooltipOpen.off('click', this.handler.handleFilterTooltipOpen).on('click', this.handler.handleFilterTooltipOpen);
      // this.el.filterTooltipOpen.off('mouseenter', this.handler.handleFilterTooltipOpen).on('mouseenter', this.handler.handleFilterTooltipOpen);
      // this.el.filterTooltipOpen.off('focuseter', this.handler.handleFilterTooltipOpen).on('focuseter', this.handler.handleFilterTooltipOpen);
      this.el.filterTextfieldCta.off('click', this.handler.handleClickFilterSelectorItem).on('click', this.handler.handleClickFilterSelectorItem);

      this.setFilterResponsive();
      this.setFilterListPosition();
      this.setExpandFilter();
      this.setFilterTooltip();
      this.setFilterChipViewMoreCTA();
      this.setFilterChipHeight();
    }

    setTextFieldState(state) {
      // state = normal, error, success
      this.el.filterTextField.target.forEach((textField) => {
        textFieldv2.setState(textField.querySelector('.text-field-v2'), state);
      });

      requestAnimationFrame(() => {
        this.setFilterItemHeight();
      });
    }

    setFilterListPosition() {
      if(this.currentDevice === 'mobile') return;

      const componentOffset = this.el.section.offset();

      this.el.filterOption.target.forEach((el) => {
        const elRect = el.getBoundingClientRect();
        const elWrap = $q(el).closest(this.selector.filterSelectorItem);

        if(this.directionFlag === 'ltr') {
          if(elRect.right > componentOffset.right) {
            elWrap.addClass(this.classes.filterOptionOffScreen);
            return;
          }

          if(elWrap.hasClass(this.classes.filterOptionOffScreen) && elRect.left < componentOffset.left) {
            elWrap.removeClass(this.classes.filterOptionOffScreen);
          }
        } else {
          if(elRect.left < componentOffset.left) {
            elWrap.addClass(this.classes.filterOptionOffScreen);
            return;
          }

          if(elWrap.hasClass(this.classes.filterOptionOffScreen) && elRect.right > componentOffset.right) {
            elWrap.removeClass(this.classes.filterOptionOffScreen);
          }
        }
      });
    }

   updateStickyHeights() {
     const topEl = document.querySelector(".pd21-top");
     const categorySection = document.querySelector(".nv19-pd-category-main");

     if (categorySection) {
       const categorySectionPseudoEl = getComputedStyle(categorySection, '::before');
       if (categorySectionPseudoEl) {
         const topHeight = categorySectionPseudoEl.getPropertyValue('height');
         topEl.style.setProperty('--top-header-height', topHeight);
       } else {
         topEl.style.setProperty('--top-header-height', '0px');
       }
     } else {
       topEl.style.setProperty('--top-header-height', '0px');
     }
   }

   setupStickyObservers() {
     if (typeof ResizeObserver === 'undefined') return;

     const categorySection = document.querySelector(".nv19-pd-category-main");

     if (categorySection) {
       const categorySectionObserver = new ResizeObserver(() => {
         if (document.contains(categorySection)) {
           this.updateStickyHeights();
         }
       });
       categorySectionObserver.observe(categorySection);

       this.categorySectionObserver = categorySectionObserver;
     }

     this.setupElementWatcher();
   }

   setupElementWatcher() {
     if (typeof MutationObserver === 'undefined') return;

     this.mutationObserver = new MutationObserver((mutations) => {
       mutations.forEach((mutation) => {
         if (mutation.removedNodes.length > 0) {
          const categorySection = document.querySelector(".nv19-pd-category-main");
           if (!categorySection) {
             this.updateStickyHeights();
           }
         }
       });
     });

     this.mutationObserver.observe(document.body, {
       childList: true,
       subtree: true
     });
   }

    setFilterTooltip() {
      if( this.currentDevice === 'desktop' ) {
        this.el.filterTooltipOpen.off('click', this.handler.handleFilterTooltipOpen);
        this.el.filterTooltipOpen.off('mouseenter', this.handler.handleFilterTooltipOpen).on('mouseenter', this.handler.handleFilterTooltipOpen);
        this.el.filterTooltipOpen.off('mouseout', this.handler.handleFilterTooltipClose).on('mouseout', this.handler.handleFilterTooltipClose);
        this.el.filterTooltipOpen.off('focusin', this.handler.handleFilterTooltipOpen).on('focusin', this.handler.handleFilterTooltipOpen);
        this.el.filterTooltipOpen.off('focusout', this.handler.handleFilterTooltipClose).on('focusout', this.handler.handleFilterTooltipClose);
      } else {
        this.el.filterTooltipOpen.off('mouseenter', this.handler.handleFilterTooltipOpen);
        this.el.filterTooltipOpen.off('mouseout', this.handler.handleFilterTooltipClose);
        this.el.filterTooltipOpen.off('focusin', this.handler.handleFilterTooltipOpen);
        this.el.filterTooltipOpen.off('focusout', this.handler.handleFilterTooltipClose).on('focusout', this.handler.handleFilterTooltipClose);
        this.el.filterTooltipOpen.off('click', this.handler.handleFilterTooltipOpen).on('click', this.handler.handleFilterTooltipOpen);
      }
    }

    handleFilterTooltipOpen(e) {
      const target = $q(e.currentTarget);
      const targetCheckbox = target.closest('.checkbox-v3');
      const tooltipWrap = target.closest(this.selector.filterTooltipWrap);
      const tooltipContentHidden = tooltipWrap.find(this.selector.filterTooltipContent);

      const tooltipContent = this.el.filter.find(this.selector.filterTooltipContentClone);

      // 툴팁 클론 구조 없을 때 생성, 이벤트 바인딩
      if( !tooltipContent.target.length ) {
        tooltipContent.target = tooltipContentHidden.clone();
        tooltipContent.removeClass('hidden');
        this.el.filter.append(tooltipContent.target[0]);
      }

      // mobile toggle close
      if( this.currentDevice === 'mobile' && tooltipContent.hasClass(this.classes.filterTooltipShow) ) {
        this.handleFilterTooltipClose();
        return;
      }

      const tooltipContetHiddenText = tooltipContent.find(this.selector.filterTooltipText);
      const tooltipContentText = tooltipContent.find(this.selector.filterTooltipText);

      if( !tooltipContetHiddenText.target.length ) return;

      tooltipContentText.innerHTML = tooltipContetHiddenText.target[0].innerHTML;

      tooltipContent.css({
        top: `${tooltipWrap.offset().top - this.el.filter.offset().top}px`,
        left: `${targetCheckbox.offset().left - this.el.filter.offset().left}px`,
        right: `${this.el.filter.offset().right - targetCheckbox.offset().right}px`,
      });

      tooltipContent.addClass(this.classes.filterTooltipShow);

      // event
      this.el.filterScrollArea.off('scroll', this.handler.handleFilterTooltipClose).on('scroll', this.handler.handleFilterTooltipClose);
    }

    handleFilterTooltipClose(e) {
      const tooltipContent = this.el.filter.find(this.selector.filterTooltipContentClone);

      if(!tooltipContent.target.length || !tooltipContent.hasClass(this.classes.filterTooltipShow)) return;

      // Close on ESC
      if( e && e.type === 'keydown' && e.keyCode !== KEY_CODE.ESC ) return;

      setTimeout(() => {
        tooltipContent.removeClass(this.classes.filterTooltipShow);
      }, 10);

      this.el.filterScrollArea.off('scroll', this.handler.handleFilterTooltipClose);
      this.el.window.off('keydown', this.handler.handleFilterTooltipClose);
    }

    handleClickFilterChipViewMore() {
      if(this.currentDevice === 'desktop') return;

      this.el.fiterChipList.toggleClass(this.classes.filterChipViewMoreClass);

      if(this.el.fiterChipList.hasClass(this.classes.filterChipViewMoreClass)) {
        this.el.filterChipViewCTA.find('span').text(this.el.filterChipViewCTA.attr('data-text-less'));
      } else {
        this.el.filterChipViewCTA.find('span').text(this.el.filterChipViewCTA.attr('data-text-more'));
      }

      this.setFilterChipHeight();
    }

   setFilterChipHeight() {
     requestAnimationFrame(() => {
       if (!this.el.fiterChipList.target.length) return;

       if (this.currentDevice === 'desktop' || this.el.filterChipViewCTA.hasClass(this.classes.filterChipViewCTAHide)) {
         if (this.currentDevice === 'desktop') {
           this.el.fiterChipList.addClass("pd21-filter__selected-list--max-height");
         } else {
           this.el.fiterChipList.removeClass("pd21-filter__selected-list--max-height");
         }

         this.setAccessibility(this.el.fiterChipList.find(this.selector.filterChipItem), true);
         this.el.fiterChipList.find(this.selector.filterChipItem).removeClass(this.classes.filterChipViewCTAHide);
         return;
       }

       const chips = this.el.fiterChipList.find(this.selector.filterChipItem).target;
       const isViewMore = this.el.fiterChipList.hasClass(this.classes.filterChipViewMoreClass);
       const maxRows = 3;

       const rowMap = new Map();
       let currentRow = 0;
       let previousTop = chips?.[0]?.offsetTop;

       chips.forEach((chip) => {
         const chipTop = chip.offsetTop;

         if (chipTop > previousTop) {
           currentRow++;
           previousTop = chipTop;
         }

         rowMap.set(chip, currentRow);
       });

       chips.forEach((chip) => {
         const row = rowMap.get(chip);
         const chipEl = $q(chip);

         if (!isViewMore && row >= maxRows) {
           chipEl.addClass(this.classes.filterChipViewCTAHide);
           this.setAccessibility(chipEl, false);
         } else {
           chipEl.removeClass(this.classes.filterChipViewCTAHide);
           setTimeout(() => {
             if (chip.getBoundingClientRect().bottom < this.el.filterChipViewCTA.offset().top) {
               this.setAccessibility(chipEl, true);
             } else {
               this.setAccessibility(chipEl, false);
             }
           }, 600);
         }
       });
     });
   }

   setFilterChipViewMoreCTA() {
     const chips = this.el.filter.find(this.selector.filterChipItem).target;
     if (chips.length === 0) {
       this.el.filterChipViewCTA.addClass(this.classes.filterChipViewCTAHide);
       return;
     }

     const rowMap = new Map();
     let currentRow = 0;
     let previousTop = chips?.[0]?.offsetTop;

     chips.forEach((chip) => {
       const chipTop = chip.offsetTop;

       if (chipTop > previousTop) {
         currentRow++;
         previousTop = chipTop;
       }

       rowMap.set(chip, currentRow);
     });

     const totalRows = currentRow + 1;

     if (totalRows > 3) {
       this.el.filterChipViewCTA.removeClass(this.classes.filterChipViewCTAHide);
     } else {
       this.el.filterChipViewCTA.addClass(this.classes.filterChipViewCTAHide);
     }
   }

    setFilterVisible(currentScrollY) {
      if(this.currentDevice === 'mobile') return;

      const hideFilter = () => {
        if(document.querySelector(".pd21-filter--close")) {
          document.querySelector(".pd21-filter--close").style.position = "static";
        }
        this.el.filter.removeClass(this.classes.filterClose);
        this.el.filter.removeClass(this.classes.filterHide);
        this.el.filter.off('transitionend');
      };

      if(this.componentTop >= 0) {
        hideFilter();
        return;
      }

      if(currentScrollY > this.scrollY) {
        // Set position: absolute IMMEDIATELY before adding classes
        const el = document.querySelector(".pd21-filter--close");
        if (el && getComputedStyle(el).position !== "absolute") {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          el.style.position = "absolute";
          requestAnimationFrame(() => {
            window.scrollTo(0, scrollY);
          });
        }
        
        // Now add the animation classes
        this.el.filter.addClass(this.classes.filterClose);
        this.el.filter.addClass(this.classes.filterHide);
        
        this.el.filter.on('transitionend', () => {
          if(this.currentDevice === 'desktop' && document.activeElement.closest(this.selector.filter)) {
            const currentSection = this.el.section.target[0];

            (currentSection.querySelectorAll(`${this.selector.sortOpen}, ${this.selector.cardsImageCTA}, ${selector.section}`)[0]).focus();
          }
        });
      } else {
        hideFilter();
      }
    }

    setExpandFilter() {
      this.el.filterOption.target.forEach((el) => {
        const targetOption = $q(el);
        const filterOption = targetOption.target[0]

        if (filterOption) {
          window.sg.common.scrollbar.reInit(filterOption);
        }
      })

      if(this.currentDevice === 'mobile') {
        for(let i = 0; i < 3; i++) {
          this.el.filterSelectorItemMenu.eq(i).addClass(this.classes.filterSelectorShowClass);
          this.el.filterSelectorItemMenu.eq(i).addClass(this.classes.filterSelectorOpenClass);
          this.el.filterSelectorItemMenu.eq(i).find(this.selector.filterOption).on('transitionend', this.handler.handleTransitionEndFilterOption);
        }
      } else {
        // this.el.filterSelectorItemMenu.removeClass(this.classes.filterSelectorOpenClass);
      }
    }

    handleClickMobileFilterHide() {
      this.hideMobileFilter();
    }

    handleClickFilterSelectorItem(e) {
      const targetItem = $q(e.currentTarget).closest(this.selector.filterSelectorItem);

      if( targetItem.hasClass(this.classes.filterSelectorShowClass) ) {
        this.closeExpandedFilter(targetItem);
        this.setFilterItemHeight();
        this.el.window.off('click', this.handler.handleClickWindow);
        this.el.window.off('focusin', this.handler.handleFocusOutTarget);
      } else {
        if(this.currentDevice === 'desktop') {
          this.closeExpandedFilter();
        }
        if(targetItem.target.length) {
          targetItem.addClass(this.classes.filterSelectorShowClass);
          targetItem.addClass(this.classes.filterSelectorOpenClass);
          
          targetItem.find(this.selector.filterOption).on('transitionend', this.handler.handleTransitionEndFilterOption);
        }
        this.setFilterItemHeight();
        this.el.window.off('click', this.handler.handleClickWindow).on('click', this.handler.handleClickWindow);
        this.el.window.off('focusin', this.handler.handleFocusOutTarget).on('focusin', this.handler.handleFocusOutTarget);
      }
    }

    handleTransitionEndFilterOption(e) {
      const target = $q(e.currentTarget);
      const targetWrap = target.closest(this.selector.filterSelectorItem);
      
      if(targetWrap.hasClass(this.classes.filterSelectorOpenClass)) return;
      targetWrap.removeClass(this.classes.filterSelectorShowClass);
      target.off('transitionend');
    }
    
    closeExpandedFilter(targetItem) {
      if(this.currentDevice === 'mobile') {
        targetItem && targetItem.removeClass(this.classes.filterSelectorOpenClass);
      } else {
        this.el.filterSelectorItem.removeClass(this.classes.filterSelectorOpenClass);
        this.el.filterSelectorItem.removeClass(this.classes.filterSelectorShowClass);
      }
      
      state.lastOpenedDropdown = "";
      state.isEddDropdownOpen = false;
    }

    setFilterItemHeight() {
      requestAnimationFrame(() => {
        if(this.currentDevice === 'mobile') {
          this.el.filterOption.target.forEach((el) => {
            const targetOption = $q(el);

            if(targetOption.closest(`.${this.classes.filterSelectorOpenClass}`).target.length) {
              const targetInnerHeight = this.getFilterOptionListHeight(targetOption);
              targetOption.css({ 'max-height': `${targetInnerHeight}px` });
            } else {
              targetOption.css({ 'max-height': 0 });
            }
          });
        } else {
          if(this.currentDevice === 'desktop') {
            // this.el.filterOption.css({ 'max-height': '145px' });
            // this.el.filterOption.css({ 'overflow-y': 'auto' });
          }
          this.el.filterOptionList.find('input:not([disabled])').removeAttr('tabindex');
          this.el.filterOptionList.find('input:not([disabled])').removeAttr('aria-hidden');
        }
      });
    }

    getFilterOptionListHeight(targetOption) {
      let maxHeight = 0;
      const hasHiddenItem = targetOption.find('.checkbox-v3').target.length > 9;

      if(hasHiddenItem) {
        const isViewMore = targetOption.closest(this.selector.filterSelectorItem).hasClass(this.classes.filterOptionViewMoreClass);

        if(isViewMore) {
          maxHeight = targetOption.find(this.selector.filterOptionList).offset().height;
          this.setAccessibility(targetOption.find('input:not([disabled])'), true);
          targetOption.find('.checkbox-v3').removeClass('checkbox-v3--hide');
        } else {
          targetOption.find('.checkbox-v3').target.forEach((checkbox, idx) => {
            if(idx <= 8) {
              maxHeight += checkbox.getBoundingClientRect().height;
            } else {
              const checkboxEl = $q(checkbox).find('input:not([disabled])');

              $q(checkbox).addClass('checkbox-v3--hide');
              this.setAccessibility(checkboxEl, false);
            }
          });
          maxHeight += targetOption.find(this.selector.filterOptionViewMoreCTA).offset().height;
        }
      } else {
        maxHeight = targetOption.find(this.selector.filterOptionList).offset().height;
      }

      return maxHeight;
    }

    handleClickFilterOptionViewMore(e) {
      const target = $q(e.currentTarget);
      const closeItem = target.closest(this.selector.filterSelectorItem);

      closeItem.toggleClass(this.classes.filterOptionViewMoreClass);

      if(closeItem.hasClass(this.classes.filterOptionViewMoreClass)) {
        // data-text-less
        target.find('span').text(target.attr('data-text-less'));
      } else {
        target.find('span').text(target.attr('data-text-more'));
      }

      this.setFilterItemHeight();
    }

    showMobileFilter() {
      this.el.filter.off('transitionend');
      this.el.filter.addClass(this.classes.mobileFilterShowClass);

      this.el.window.off('click', this.handler.handleClickWindow).on('click', this.handler.handleClickWindow);
      this.el.window.off('focusin', this.handler.handleFocusOutTarget).on('focusin', this.handler.handleFocusOutTarget);

      this.setFilterChipViewMoreCTA();
      this.setFilterItemHeight();
      this.setFilterChipHeight();
      utils.setMobileFocusLoop(this.el.filter.target[0]);

      this.el.section.setLayerFocus(this.selector.mobileFilterCloseCTA, `${this.selector.filterMoCTA} .cta:last-child`);

      window.sg.components.Pd21Modules.Utils.hiddenScroll();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.el.filter.addClass(this.classes.mobileFilterOpenClass);

          const filterEl = this.el.filter.target[0];

          this.onFilterTransitionEnd = (e) => {
            if (e.target !== filterEl || e.propertyName !== 'transform') return;
            filterEl.style.transition = 'background-color .3s ease';
            filterEl.style.backgroundColor = 'rgba(0,0,0,0.6)';
            filterEl.removeEventListener('transitionend', this.onFilterTransitionEnd);
          };
          filterEl.addEventListener('transitionend', this.onFilterTransitionEnd);
        });
      });
    }

    hideMobileFilter() {
      const filterEl = this.el.filter.target[0];

      filterEl.style.transition = '';
      filterEl.style.backgroundColor = '';

      if (this.onFilterTransitionEnd) {
        filterEl.removeEventListener('transitionend', this.onFilterTransitionEnd);
        this.onFilterTransitionEnd = null;
      }

      this.handleFilterTooltipClose();
      this.el.filter.removeClass(this.classes.mobileFilterOpenClass);
      this.el.filter.off('transitionend').on('transitionend', () => this.el.filter.removeClass(this.classes.mobileFilterShowClass));
      this.el.window.off('click', this.handler.handleClickWindow);
      this.el.window.off('focusin', this.handler.handleFocusOutTarget);
      utils.removeMobileFocusLoop();
      this.el.section.offLayerFocus();
      window.sg.components.Pd21Modules.Utils.visibleScroll();
      requestAnimationFrame(() => this.el.topHeader.removeClass(this.classes.topHeaderHide));

      this.el.mobileFilterOpenCTA.target[0].focus();
    }

    setFilterResponsive() {
      const targetChipList = this.el.section.find(this.selector.fiterChipList);

      if( !targetChipList.target.length ) return;

      if( this.currentDevice === 'desktop' ) {
        this.el.fitlerSelectorList.target[0].insertAdjacentElement('afterend', targetChipList.target[0]);
      } else {
        this.el.fitlerSelectorList.target[0].insertAdjacentElement('beforebegin', targetChipList.target[0]);
      }
    }

    setClearAll() {
      const filterChipItem = this.el.fiterChipList.find(this.selector.filterChipItem);
      filterChipItem.remove();
   }

   convertToPx(value) {
     if (!value) return 0;

     if (value.includes('vw')) {
       const vw = parseFloat(value);
       return (vw * window.innerWidth) / 100;
     }

     return parseFloat(value);
   }

    scrollTop() {
      const section = this.el.section.target[0];
      const rect = section.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;

      let topHeight = 1; // safe offset

      const topEl = section.querySelector('.pd21-top');
      const categorySection = document.querySelector(".nv19-pd-category-main");

      if (categorySection) {
        const categorySeudoElHeight = getComputedStyle(categorySection, '::before').getPropertyValue('height');

        topHeight = (!categorySeudoElHeight || categorySeudoElHeight === 'auto')
          ? getComputedStyle(topEl).getPropertyValue('--category-pseudo-el-height')
          : categorySeudoElHeight;

          topHeight = this.convertToPx(topHeight);
      }

      const SAFE_OFFSET = 1;

      window.scrollTo({
        top: Math.max(0, absoluteTop - Math.max(topHeight, SAFE_OFFSET)),
        behavior: 'smooth'
      });

      setTimeout(() => {
        this.updateStickyHeights();
        this.setOnScreen();
      }, 600);
    }

    // Sort
    reInitSort() {
      this.el.sort = this.el.section.find(this.selector.sort);
      this.el.sortOpen = this.el.sort.find(this.selector.sortOpen);
      this.el.sortClose = this.el.sort.find(this.selector.sortClose);
      this.el.sortContents = this.el.sort.find(this.selector.sortContents);
      this.el.sortHeadName = this.el.sort.find(this.selector.sortHeadName);
      this.el.sortItemInput = this.el.sort.find(this.selector.sortItemInput);
      this.el.sortSelectName = this.el.sort.find(this.selector.sortSelectedName);
      this.el.mobileSortCloseButton = this.el.sort.find(this.selector.mobileSortCloseButton);
      this.el.sortApply = this.el.sort.find(this.selector.sortApply);

      this.el.sortOpen.off('click', this.handler.handleClickSortOpen).on('click', this.handler.handleClickSortOpen);
      this.el.sortItemInput.off('click', this.handler.handleChangeSortItem).on('click', this.handler.handleChangeSortItem);
      this.el.mobileSortCloseButton.off('click', this.handler.handleClickSortClose).on('click', this.handler.handleClickSortClose);
      this.el.sortApply.off('click', this.handler.handleClickSortApply).on('click', this.handler.handleClickSortApply);
      this.el.sortItemInput.off('keydown', this.handler.handleKeyDownSortItem).on('keydown', this.handler.handleKeyDownSortItem);

      this.setSelectedItem();
      this.checkActiveSort();
    }

    handleKeyDownSortItem(e) {
      const target = $q(e.target);
      const index = target.closest('.radio-v3').index();
      const radios = this.el.sortItemInput.target;
      let newIndex = index;

      if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        newIndex = (index + 1) % radios.length;
        radios[newIndex].focus();
      }

      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        newIndex = (index - 1 + radios.length) % radios.length;
        radios[newIndex].focus();
      }
    }

    setSelectedItem() {
      if(!this.el.sort.target.length) return;

      this.prevSortedItem = this.el.sortContents.find(this.selector.sortSelectedItem);

      let text = this.prevSortedItem.find('.radio-v3__label-text')?.target[0]?.textContent;
      text = truncateText(text, 26);
      this.el.sortSelectName.text(text);
    }

    handleClickSortClose() {
      this.hideSortContets();
    }

    handleClickSortOpen() {
      if(this.el.sortContents.hasClass(this.classes.sortShowClass)) {
        this.hideSortContets();
      } else {
        this.showSortContets();
        this.closeExpandedFilter();
      }
    }

    handleChangeSortItem() {
      this.checkActiveSort();

      if (this.currentDevice === 'desktop') {
        this.hideSortContets()
      }
    }

    showSortContets() {
      this.el.sortContents.off('transitionend');
      this.el.sortContents.addClass(this.classes.sortShowClass);

      this.el.window.off('click', this.handler.handleClickWindow).on('click', this.handler.handleClickWindow);
      this.el.window.off('focusin', this.handler.handleFocusOutTarget).on('focusin', this.handler.handleFocusOutTarget);

      if (this.currentDevice === 'mobile') {
        utils.setMobileFocusLoop(this.el.sortContents.target[0]);
        this.el.section.setLayerFocus(this.selector.sortClose, this.selector.sortApply);
        window.sg.components.Pd21Modules.Utils.hiddenScroll();

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.el.sortContents.addClass(this.classes.sortOpenClass);

            const sortEl = this.el.sortContents.target[0];

            this.onSortTransitionEnd = (e) => {
              if (e.target !== sortEl || e.propertyName !== 'transform') return;
              sortEl.style.transition = 'background-color .3s ease';
              sortEl.style.backgroundColor = 'rgba(0,0,0,0.6)';
              sortEl.removeEventListener('transitionend', this.onSortTransitionEnd);
            };
            sortEl.addEventListener('transitionend', this.onSortTransitionEnd);
          });
        });
      } else {
        // desktop
        this.el.sortContents.addClass(this.classes.sortOpenClass);
      }

      setTimeout(() => {
        this.el.sort.find(`${this.selector.sortItemInput}:checked`)?.target[0]?.focus();
      }, 500);
    }

    hideSortContets() {
      const sortEl = this.el.sortContents.target[0];

      sortEl.style.transition = '';
      sortEl.style.backgroundColor = '';

      if (this.onSortTransitionEnd) {
        sortEl.removeEventListener('transitionend', this.onSortTransitionEnd);
        this.onSortTransitionEnd = null;
      }

      this.el.sortContents.removeClass(this.classes.sortOpenClass);
      this.el.sortContents.off('transitionend').on('transitionend', () => {
        this.el.sortContents.removeClass(this.classes.sortShowClass);
      });

      this.el.window.off('click', this.handler.handleClickWindow);
      this.el.window.off('focusin', this.handler.handleFocusOutTarget);
      window.sg.components.Pd21Modules.Utils.visibleScroll();

      if (this.currentDevice === 'mobile') {
        utils.removeMobileFocusLoop();
        this.el.section.offLayerFocus();
        this.prevSortedItem.find('input').target[0].checked = true;
        let text = this.prevSortedItem.find('.radio-v3__label-text')?.target[0]?.textContent;
        text = truncateText(text, 26);
        this.el.sortSelectName.text(text);
        requestAnimationFrame(() => this.el.topHeader.removeClass(this.classes.topHeaderHide));
      }

      if (document.activeElement.closest(this.selector.sortContents)) {
        this.el.sortOpen.target[0].focus();
      }
    }

    checkActiveSort() {
      const activeItem = this.el.sortContents.find(this.selector.sortSelectedItem);

      if( !activeItem.target.length ) return;

      const activeText = activeItem.find('.radio-v3__label-text').target[0].textContent;
      if(this.currentDevice === 'desktop') {
        this.prevSortedItem = activeItem;
        let text = truncateText(activeText, 26);
        this.el.sortSelectName.text(text);
      }

      let text = truncateText(activeText, 21);
      this.el.sortHeadName.text(text);
    }

    handleClickSortApply() {
      this.prevSortedItem = this.el.sortContents.find(this.selector.sortSelectedItem);
      this.hideSortContets();
    }

    // Compare Bar
    reInitCompareBar() {
      this.el.compareBar = this.el.section.find(this.selector.compareBar);
      this.el.compareBarCTA = this.el.section.find(this.selector.compareBarCTA);
      this.el.compareBarToggle = this.el.section.find(this.selector.compareBarToggle);
      this.el.compareBarClose = this.el.section.find(this.selector.compareBarClose);
      this.el.compareBarItem = this.el.section.find(this.selector.compareBarItem);

      this.el.compareBarToggle.off('click', this.handler.handleClickCompareBarToggle).on('click', this.handler.handleClickCompareBarToggle);
      this.el.compareBarClose.off('click', this.handler.handleClickComparebarClose).on('click', this.handler.handleClickComparebarClose);

      lazyLoad.forceLoad(this.el.compareBar.target[0]);
      this.setCompareCTA();
    }

    handleClickComparebarClose() {
      this.hideCompareBar();
    }

    setCompareCTA() {
      const isDisabledCTA = this.el.compareBar.find(this.selector.compareBarActiveItem).target.length < 2;

      if(isDisabledCTA) {
        this.el.compareBarCTA.addClass('cta--disabled');
        this.el.compareBarCTA.attr('disabled', true);
      } else {
        this.el.compareBarCTA.removeClass('cta--disabled');
        this.el.compareBarCTA.removeAttr('disabled');
      }
    }

    handleClickCompareBarToggle() {
      this.el.compareBar.toggleClass(this.classes.compareBarToggleClass);

      if(!this.el.compareBar.hasClass(this.classes.compareBarToggleClass)) {
        this.el.topHeader.removeClass(this.classes.topHeaderHide);
      }
    }

    showCompareBar() {
      const $comparbarCTA = $(".pd21-compare-bar__cta");
      const $comparebarTitle = $(".pd21-compare-bar__title-text");

      $comparbarCTA.text(truncateText("Compare", 15));
      $comparebarTitle.text(truncateText("Selected ", 14));

      state.preventAutoScroll = true;

      this.el.compareBar.addClass(this.classes.compareBarShow);

      requestAnimationFrame(() => {
        this.el.compareBar.removeClass(this.classes.compareBarToggleClass);

        requestAnimationFrame(() => {
          this.scrollY = window.scrollY;
          state.preventAutoScroll = false;
        });
      });
    }

    hideCompareBar() {
      state.preventAutoScroll = true;
      this.el.compareBarItem.removeClass(this.classes.compareBarActiveItemClass);
      this.el.compareBar.removeClass(this.classes.compareBarShow);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.scrollY = window.scrollY;
          state.preventAutoScroll = false;
        });
      });
    }

    // Card
    reInitCards() {
      this.el.cardsList = this.el.section.find(this.selector.cardsList);
      this.el.cards = this.el.section.find(this.selector.cards);
      this.el.cardsProduct = this.el.section.find(`${this.selector.cards}:not(${this.selector.cardsBanner})`);
      this.el.cardsBanner = this.el.section.find(this.selector.cardsBanner);
      this.el.cardsColorChipText = this.el.section.find(this.selector.cardsColorChipText);
      this.el.cardsComboSwiper = this.el.section.find(this.selector.cardsComboSwiper);
      this.el.cardsImageCTA = this.el.section.find(this.selector.cardsImageCTA);
      this.el.cardsName = this.el.section.find(this.selector.cardsName);
      this.el.cardsRating = this.el.section.find(this.selector.cardsRating);

      this.el.cardsColorChipText.off('mouseenter', this.handler.handleMouseEnterColorTooltip).on('mouseenter', this.handler.handleMouseEnterColorTooltip);

      if (this.currentDevice === 'desktop') {
        this.destroyCardImageSwipers();

        this.el.cardsImageCTA.off('mouseenter', this.handler.handleMouseEnterCard).on('mouseenter', this.handler.handleMouseEnterCard);
        this.el.cardsImageCTA.off('focusin', this.handler.handleMouseEnterCard).on('focusin', this.handler.handleMouseEnterCard);
        this.el.cardsImageCTA.off('mouseleave', this.handler.handleMouseLeaveCard).on('mouseleave', this.handler.handleMouseLeaveCard);
        this.el.cardsImageCTA.off('focusout', this.handler.handleMouseLeaveCard).on('focusout', this.handler.handleMouseLeaveCard);
      } else {
        this.el.cardsImageCTA.off('mouseenter', this.handler.handleMouseEnterCard);
        this.el.cardsImageCTA.off('focusin', this.handler.handleMouseEnterCard);
        this.el.cardsImageCTA.off('mouseleave', this.handler.handleMouseLeaveCard);
        this.el.cardsImageCTA.off('focusout', this.handler.handleMouseLeaveCard);
      }

      // optionSelectorV2.reInit(this.selector.cards);
      this.setCardTitleOverflow();
      this.setCardComboSwiper();
      this.setActiveCard();
      this.setBannerCardIndexAttr();
      // this.setBannerCardPosition();
      this.setRatingAccessibility();
      this.reInitTooltip();
    }

    reInitTooltip() {
      this.el.tooltipOpen = this.el.section.find(this.selector.tooltipShow);

      this.el.tooltipOpen.target.forEach((el) => {
        const tooltipOpen = $q(el);
        const isHover = tooltipOpen.closest(this.selector.tooltip).attr(this.selector.tooltipHover);

        if (isHover !== 'false') {
          tooltipOpen.off('mouseenter').on('mouseenter', (e) => this.handler.handleTooltipOpen(e, this.isTooltipOverflow.bind(this)));
          tooltipOpen.off('focus').on('focus', (e) => this.handler.handleTooltipOpen(e, this.isTooltipOverflow.bind(this)));
        }

        tooltipOpen.off('click').on('click', (e) => this.handler.handleTooltipOpen(e, this.isTooltipOverflow.bind(this)));
      });
    }

    handleTooltipOpen(e, callback) {
      const openBtn = $q(e.currentTarget);
      const targetTooltip = openBtn.closest(this.selector.tooltip);
      const newFocus = e.relatedTarget || document.activeElement;
      const closeBtn = targetTooltip.find(this.selector.tooltipHide);
      const isHover = targetTooltip.attr(this.selector.tooltipHover);

      // click open toggle
      if (isHover === 'false' && e.type === 'click' && targetTooltip.attr('data-tooltip-show') === 'true') {
        this.tooltipClose(targetTooltip);
        return;
      }

      // 포커스 이동이 같은 컨테이너 일 때 return
      if (e.type === 'focus' && targetTooltip.target[0].contains(newFocus)) return;

      this.focusTargetEl = e && e.currentTarget;

      // 툴팁 오픈 전 모든 툴팁 닫기
      this.tooltipClose();

      // hover open event bind
      if (isHover !== 'false') {
        targetTooltip.off('mouseleave', this.handler.handleTooltipClose).on('mouseleave', this.handler.handleTooltipClose);
        targetTooltip.off('focusout', this.handler.handleTooltipClose).on('focusout', this.handler.handleTooltipClose);
      }

      closeBtn.off('click', this.handler.handleTooltipClose).on('click', this.handler.handleTooltipClose);

      setTimeout(() => {
        $q(document).off('click', this.handler.handleTooltipClose).on('click', this.handler.handleTooltipClose);
        $q(document).off('keydown', this.handler.handleTooltipClose).on('keydown', this.handler.handleTooltipClose);
      }, 10);

      openBtn.attr('aria-expanded', true);
      targetTooltip.attr('data-tooltip-show', true);

      this.resetCallback = callback(targetTooltip.target[0]);
    }

    handleTooltipClose(e) {
      const evtType = e.type;
      const evtTarget = $q(e.target);
      const newFocus = e.relatedTarget || document.activeElement;
      const targetTooltip = evtTarget.closest(this.selector.tooltip);

      if (evtType === 'focusout' && targetTooltip.target[0].contains(newFocus)) return;
      if (evtType === 'keydown' && e.keyCode !== KEY_CODE.ESC) return;
      if (evtType === 'click' && !evtTarget.closest(this.selector.tooltipHide).target.length && evtTarget.closest(this.selector.tooltip).target.length) return;

      this.tooltipClose();

      this.resetCallback && this.resetCallback();
      this.resetCallback = null;

      // focusout el과 return focus el 이 같을 경우, mouseleave일 경우 예외적용
      this.focusTargetEl && (this.focusTargetEl !== evtTarget.target[0]) && (evtType !== 'mouseleave') && this.focusTargetEl.focus();
      this.focusTargetEl = null;
    }

    tooltipClose(tooltip) {
      const targetTooltip = !tooltip ? this.el.section.find(this.selector.tooltip) : (tooltip.target ? tooltip : $q(tooltip));
      const openBtn = targetTooltip.find(this.selector.tooltipShow);
      const closeBtn = targetTooltip.find(this.selector.tooltipHide);

      targetTooltip.off('mouseleave', this.handler.handleTooltipClose);
      targetTooltip.off('focusout', this.handler.handleTooltipClose);

      closeBtn.off('click', this.handler.handleTooltipClose);

      $q(document).off('click', this.handler.handleTooltipClose);
      $q(document).off('keydown', this.handler.handleTooltipClose);

      openBtn.attr('aria-expanded', false);
      targetTooltip.attr('data-tooltip-show', false);
    }

    isTooltipOverflow(tooltip) {
      const targetTooltip = $q(tooltip);
      const tooltipLayerOffset = targetTooltip.find(this.selector.tooltipLayer).offset();

      if (tooltipLayerOffset.right > window.innerWidth) {
        targetTooltip.attr('data-tooltip-overflow', true);
      }

      return function () {
        targetTooltip.attr('data-tooltip-overflow', false);
      };
    }

    setRatingAccessibility() {
      this.el.cardsRating.target.forEach((rating) => {
        if(!rating.querySelector('.rating')) {
          rating.setAttribute('tabindex', '-1');
        }
      });
    }

    setBannerCardIndexAttr() {
      this.el.cards.target.forEach((el, idx) => {
        if(el.getAttribute('data-productidx')) return;

        el.setAttribute('data-productidx', idx);
      });
    }

    setBannerCardPosition() {
      /**
       * 컨텐츠 카드 위치
       * PC: 원래의 위치
       * MO: (6N - 1)th Product card 의 뒤
       *      || Product card 짝수: 마지막 Product card 뒤
       *      || Product card 홀수: 마지막 Product card 앞
      */
      if(this.currentDevice === 'desktop') {
        const sortedCards = this.el.cards.target.sort((a, b) => Number(a.dataset.productidx) - Number(b.dataset.productidx));
      
        // sortedCards.forEach((item) => this.el.cardsList.target[0].appendChild(item));
      } else {
        const productCard = this.el.cardsProduct.target;

        this.el.cardsBanner.target.forEach((item, idx) => {
          const target = productCard.at(6 * (idx + 1));

          if(target) {
            target.insertAdjacentElement('beforebegin', item);
            return;
          }

          // if(productCard.length % 2 === 0) {
          //   this.el.cardsList.target[0].insertAdjacentElement('beforeend', item);
          // } else {
          //   productCard.at(-1).insertAdjacentElement('beforebegin', item);
          // }
        });
      }

      // this.setCardHeight();
    }

    setCardTitleOverflow() {
      if(this.currentDevice === 'mobile') return;

      this.el.cardsName.target.forEach((el) => {
        const elHeight = el.offsetHeight;
        const textHeight = el.scrollHeight;

        if(textHeight > elHeight) {
          $q(el).addClass(this.classes.cardTitleOverflow);
        } else {
          $q(el).removeClass(this.classes.cardTitleOverflow);
        }
      });
    }

    setActiveCard() {
      let index = 0;
      this.el.section.find(`${this.selector.cards}:not(.${this.classes.cardActive})`).target.forEach((card) => {
        if(utils.isVerticalVisible(card)) {
          setTimeout(() => {
            $q(card).addClass(this.classes.cardActive);
          }, 170 * index++);
        }
      });
    }

    setCardHeight() {
      const columnCount = this.currentDevice === 'desktop' ? 4 : 2;
      const itemLength = this.el.cards.target.length;

      for(let i = 0; i < Math.ceil(itemLength / columnCount); i++) {
        const tempArray = $q((this.currentDevice === 'desktop' ? this.el.cards : this.el.cardsProduct).target.slice((i * columnCount), (i * columnCount) + columnCount));

        this.selector.sameHeight.forEach((classStr) => {
          const sameEl = tempArray.find(classStr);
          const sameElChild = sameEl.children();
          const minHeight = Math.max(...sameElChild.target.map((el) => el.offsetHeight), 0);
          sameEl.css({ 'min-height': `${minHeight}px` });
        });
      }
    }

    handleMouseEnterCard(e) {
      if(this.currentDevice === 'mobile' || this.isCardImageTransform) return;

      this.isCardImageTransform = true;
      const target = $q(e.currentTarget);
      const targetImagWrap = target.find(this.selector.cardsImageWrap);
      const imageElLength = targetImagWrap.find('.image').target.length;
      const moveDirection = this.directionFlag === 'ltr' ? -100 : 100 ;
      lazyLoad.forceLoad(targetImagWrap.target[0]);
      let index = 0;
      function imageChange() {
        targetImagWrap.css({ transform: `translateX(${(moveDirection * index)}%)` });
        if(index < imageElLength - 1) {
          index++;
        } else {
          index = 0;
        }
      }

      imageChange();

      this.imageMoveTimer = setInterval(() => {
        imageChange();
      }, 500);
    }

    handleMouseLeaveCard(e) {
      if(this.imageMoveTimer) clearInterval(this.imageMoveTimer);
      this.isCardImageTransform = false;
      const targetImagWrap = $q(e.currentTarget).find(this.selector.cardsImageWrap);
      targetImagWrap.css({ transform: 'translateX(0)' });
    }

    handleMouseEnterColorTooltip(e) {
      const targetName = $q(e.currentTarget);
      const targetText = targetName.find('span').target[0];

      if(targetText.scrollWidth <= targetText.clientWidth) return;

      const closeTooltip = () => {
        targetName.off('mouseleave');
        targetName.find(this.selector.cardsTooltipClose).off('click');
        targetName.removeClass(this.classes.cardTooltipShow);
      };

      targetName.addClass(this.classes.cardTooltipShow);
      targetName.find(this.selector.cardsTooltipClose).on('click', closeTooltip);
      targetName.on('mouseleave', closeTooltip);
    }

    setCardComboSwiper() {
      this.comboSwiper = [];
      this.el.cardsComboSwiper.target.forEach((item) => {
        if (item.querySelectorAll(this.selector.cardsComboSlide).length <= 1) return;
        if(this.comboSwiperInstances.has(item)) return;

        const paginationPrev = $q(item).find(this.selector.comboArrowPrev).target;
        const paginationNext = $q(item).find(this.selector.comboArrowNext).target;

        // eslint-disable-next-line no-undef
        const comboSwiper = new Swiper(item, {
          centeredSlides: true,
          navigation: {
            prevEl: paginationPrev,
            nextEl: paginationNext,
          },
        });

        this.comboSwiperInstances.set(item, comboSwiper);
      });
    }

   setCardImageSwiper() {
     if (this.currentDevice !== 'mobile') return;

     this.el.section.find(this.selector.cardsImageWrap).target.forEach((imageWrap) => {
       if (!imageWrap) return;
       if (imageWrap.querySelectorAll('.swiper-slide').length <= 1) return;

       imageWrap.style.transform = '';

       if (this.imageSwiperInstances.has(imageWrap)) {
         this.imageSwiperInstances.get(imageWrap).update();
         return;
       }

       const swiper = new Swiper(imageWrap, {
         loop: true,
         touchStartPreventDefault: false,
       });

       this.imageSwiperInstances.set(imageWrap, swiper);
     });
   }

   destroyCardImageSwipers() {
     this.el.section.find(this.selector.cardsImageWrap).target.forEach((imageWrap) => {
       if (!this.imageSwiperInstances.has(imageWrap)) return;

       const swiper = this.imageSwiperInstances.get(imageWrap);
       swiper.destroy(true, true);
       this.imageSwiperInstances.delete(imageWrap);
     });
   }

    // Quickview
    reInitQuickView() {
      this.el.quickView = this.el.section.find(this.selector.quickView);
      this.el.quickViewClose = this.el.section.find(this.selector.quickViewClose);
      this.el.quickViewVideoBtn = this.el.section.find(this.selector.quickViewVideoBtn);
      this.el.quickViewFiche = this.el.section.find(this.selector.quickViewFiche);
      this.el.quickViewScrollWrap = this.el.quickView.find('.scrollbar__wrap');

      this.el.quickViewVideoBtn.off('click', this.handler.handleClickVideoPlay).on('click', this.handler.handleClickVideoPlay);
      this.el.quickViewScrollWrap.off('scroll', this.handler.handleScrollQuickView).on('scroll', this.handler.handleScrollQuickView);
      this.el.quickView.off('mousedown', this.handler.handleMouseDownQuickViewClose).on('mousedown', this.handler.handleMouseDownQuickViewClose);
      this.el.quickView.off('mouseup', this.handler.handleMouseUpQuickViewClose).on('mouseup', this.handler.handleMouseUpQuickViewClose);
      this.el.quickViewClose.off('click', this.handler.handleClickQuickViewClose).on('click', this.handler.handleClickQuickViewClose);
      this.el.window.off('resize', this.handler.handleResizeQuickView).on('resize', this.handler.handleResizeQuickView);

      this.setQuickViewImageSwiper();
      optionSelectorV2.reInit(this.selector.quickView);
      this.setQuickViewComboSwiper();
    }

    setQuickViewImageSwiper() {
      if(!this.el.section.find(this.selector.quickViewImage).target.length) return;

      swiperManager.slideReInit(this.el.section.find(this.selector.quickViewImage).target[0]);
    }

    handleScrollQuickView() {
      const scrollWrap = this.el.quickViewScrollWrap.target[0];

      if(scrollWrap.scrollTop > 0) {
        this.el.quickView.addClass(this.classes.quickViewScrollClass);
      } else {
        this.el.quickView.removeClass(this.classes.quickViewScrollClass);
      }
    }

    setQuickViewComboSwiper() {
      if(this.el.quickViewFiche.find(this.selector.quickViewComboSlide).target.length > 1) {
        const item = this.el.quickViewFiche.find(this.selector.quickViewCombo).target[0];
        if(this.comboSwiperInstances.has(item)) return;

        const paginationPrev = $q(item).find(this.selector.comboArrowPrev).target;
        const paginationNext = $q(item).find(this.selector.comboArrowNext).target;

        // eslint-disable-next-line no-undef
        const comboSwiper = new Swiper(item, {
          centeredSlides: true,
          navigation: {
            prevEl: paginationPrev,
            nextEl: paginationNext,
          },
        });

        this.comboSwiperInstances.set(item, comboSwiper);
      }
    }

    handleClickVideoPlay(e) {
      const targetBtn = $q(e.currentTarget);
      const slide = targetBtn.closest(this.selector.quickViewImageSlide);
      const currentSwiper = swiperManager.getSwiper(slide.closest(this.selector.quickViewImage).target[0]);
      const video = slide.find('video');
      const puaseVideo = () => {
        currentSwiper.off('slideChange', puaseVideo);
        video.off('pause');
        video.target[0].pause();
      };
      const endVideo = () => {
        video.off('pause');
        video.off('ended');
        video.target[0].currentTime = 0;
        slide.removeClass(this.classes.quickViewVideoPlayClass);
        video.removeAttr('controls');
      };

      slide.addClass(this.classes.quickViewVideoPlayClass);
      video.target[0].play();
      video.attr('controls', true);
      currentSwiper.on('slideChange', puaseVideo);
      video.on('pause', puaseVideo);
      video.on('ended', endVideo);
    }

    handleMouseDownQuickViewClose(e) {
      const target = $q(e.target);
      if(target.hasClass(this.classes.quickView)) {
        this.isTargetQuickView = true;
      } else {
        this.isTargetQuickView = false;
      }
    }

    handleMouseUpQuickViewClose(e) {
      const target = $q(e.target);
      if(this.isTargetQuickView && target.hasClass(this.classes.quickView)) {
        this.hideQuickView();
      }
    }

    handleClickQuickViewClose() {
      this.hideQuickView();
    }

    handleResizeQuickView() {
      const isFullScreen = document.fullScreen ||  document.mozFullScreen || document.webkitIsFullScreen || (document.msFullscreenElement != null);

      if(isFullScreen) {
        this.wasFullScreen = isFullScreen;
        return;
      } else if(this.wasFullScreen) {
        this.wasFullScreen = isFullScreen;
        return;
      }

      this.hideQuickView();
    }

    showQuickView(el) {
      state.preventAutoScroll = true;
      this.focusTargetEl = el;
      this.el.quickView.addClass(this.classes.quickViewShow);
      this.el.quickView.addClass(this.classes.quickViewOpen);
      this.setQuickViewImageSwiper();
      utils.setMobileFocusLoop(this.el.quickView.target[0]);
      this.el.section.setLayerFocus(this.selector.quickView, this.selector.quickViewClose);
      window.sg.components.Pd21Modules.Utils.hiddenScroll();
      const quickViewScrollbar = document.querySelector(`.${this.classes.quickViewScrollbar}`);
      if(quickViewScrollbar) {
        window.sg.common.scrollbar.reInit(quickViewScrollbar);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.scrollY = window.scrollY;
          state.preventAutoScroll = false;
        });
      });
    }

    hideQuickView() {
      if(!this.el.quickView.hasClass(this.classes.quickViewShow)) return;
      state.preventAutoScroll = true;

      const playingVideo = this.el.quickView.find(this.selector.quickViewVideoPlay).find('video').target[0];
      const quickViewScrollbar = document.querySelector(`.${this.classes.quickViewScrollbar}`);


      playingVideo && playingVideo.pause();
      this.el.quickView.removeClass(this.classes.quickViewOpen);
      window.sg.common.scrollbar.destroy(quickViewScrollbar);
      this.el.quickView.on('transitionend', () => {
        this.el.quickView.removeClass(this.classes.quickViewShow);
        window.sg.components.Pd21Modules.Utils.visibleScroll();
        utils.removeMobileFocusLoop();
        this.el.section.offLayerFocus();
        this.focusTargetEl.focus();
        this.el.quickView.off('transitionend');
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.scrollY = window.scrollY;
            state.preventAutoScroll = false;
          });
        });
      });
    }
  }

  Pd21ProductFinder.instances = new WeakMap();

  function init() {
      $q(selector.section).target.forEach((element) => {
      if( !Pd21ProductFinder.instances.has(element) ) {
          new Pd21ProductFinder(element);
        }
      });
  }

  function reInit() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).reInit();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function scrollTop() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ProductFinder.instances.has(element)) {
        Pd21ProductFinder.instances.get(element).scrollTop();
      }
    });
  }

  function reInitSort() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).reInitSort();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function reInitFilter() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).reInitFilter();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function setFilterChipHeight() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).setFilterChipHeight();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function setFilterChipViewMoreCTA() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).setFilterChipViewMoreCTA();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function showMobileFilter() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).showMobileFilter();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function hideMobileFilter() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).hideMobileFilter();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function reInitCards() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).reInitCards();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function reInitQuickView() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).reInitQuickView();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function reInitCompareBar() {
    $q(selector.section).target.forEach((element) => {
      if( Pd21ProductFinder.instances.has(element) ) {
        Pd21ProductFinder.instances.get(element).reInitCompareBar();
      } else {
        new Pd21ProductFinder(element);
      }
    });
  }

  function setClearAll() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ProductFinder.instances.has(element)) {
        Pd21ProductFinder.instances.get(element).setClearAll();
      }
    });
  }

  function showQuickView(openBtn) {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ProductFinder.instances.has(element)) {
        Pd21ProductFinder.instances.get(element).showQuickView(openBtn);
      }
    });
  }

  function hideQuickView() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ProductFinder.instances.has(element)) {
        Pd21ProductFinder.instances.get(element).hideQuickView();
      }
    });
  }

  function showCompareBar() {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ProductFinder.instances.has(element)) {
        Pd21ProductFinder.instances.get(element).showCompareBar();
      }
    });
  }

  // state = normal, error, success
  function setTextFieldState(state) {
    $q(selector.section).target.forEach((element) => {
      if (Pd21ProductFinder.instances.has(element)) {
        Pd21ProductFinder.instances.get(element).setTextFieldState(state);
      }
    });
  }

  window.sg.components.Pd21ProductFinder = {
    init,
    reInit,
    scrollTop,
    reInitFilter,
    reInitSort,
    reInitCards,
    reInitQuickView,
    reInitCompareBar,
    setClearAll,
    setFilterChipHeight,
    setFilterChipViewMoreCTA,
    showMobileFilter,
    hideMobileFilter,
    showQuickView,
    hideQuickView,
    showCompareBar,
    setTextFieldState,
  };

  $q.ready(init);
})();

(function ($) {
  'use strict';

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;
  const apis = pd21Modules.ApiService;
  const utils = pd21Modules.Utils;
  const categoryUtils = pd21Modules.CategoryUtils;

  const pageTrack = $("#pfPageTrack").val();
  
  const filterOptionsViewMoreText = utils.truncateText("View more", 30);
  const filterOptionsViewLessText = utils.truncateText("View less", 30);

  const defaultZipcode = '10001';
  let zipCodePromise;

  function getZipcode() {
    if(!state.showEddFilter) return;

    if (zipCodePromise) return zipCodePromise;

    zipCodePromise = (async function () {
      let zipCodeCookie = '';
      zipCodeCookie = /^[0-9]{5}$/.test($.cookie('eddzipcode')) ? $.cookie('eddzipcode') : ''; // First check the zipcode eddzipcode cookie 

      if (!zipCodeCookie) { // If not present in eddzipcode cookie then check in 'HA-Deeplink-Zipcode' cookie
        zipCodeCookie = /^[0-9]{5}$/.test($.cookie('HA-Deeplink-Zipcode')) ? $.cookie('HA-Deeplink-Zipcode') : '';
      }

      if (zipCodeCookie) {
        state.zipCode = zipCodeCookie;
        $('.text-field-v2__zipcode').val(state.zipCode);
        return state.zipCode;
      }

      if (!state.zipCode) {
        if (!navigator || !navigator.geolocation) {
          state.zipCode = defaultZipcode;
          return state.zipCode;
        }

        return new Promise(function (resolve) {
          /* Geolocation for EDD */
          navigator.geolocation.getCurrentPosition(function (data) {
            apis.fetchLocation(String(data.coords.latitude), String(data.coords.longitude))
              .then(function (res) {
                if (res && res.postal_code && res.postal_code.length === 5) {
                  $.cookie('HA-Deeplink-Zipcode', res.postal_code, {
                    path: '/',
                    domain: '.samsung.com',
                  });
                  // $.cookie('eddzipcode', res.postal_code, {
                    // path: '/',
                    // domain: '.samsung.com',
                  // });
                  state.zipCode = res.postal_code;
                  resolve(res.postal_code);
                } else {
                  state.zipCode = defaultZipcode;
                  resolve(state.zipCode);
                }
              }).catch(function (error) {
                console.error("Fetch location error:", error);
                state.zipCode = defaultZipcode;
                resolve(state.zipCode);
              })
              .finally(async function () {
                await apis.updateCartZipcode(state.zipCode);
                await apis.validateZipcode(state.zipCode);
              });
          }, function (error) {
            console.error("Fetch location error:", error);
            state.zipCode = defaultZipcode;
            resolve(state.zipCode);
          });
        });
      }

      return state.zipCode;
    })();

    zipCodePromise.then(function (zipCode) {
      $('.text-field-v2__zipcode').val(zipCode);
    });

    return zipCodePromise;
  }

  getZipcode();

  const EddFilters = (function ($) {

    // Fetch EDD data for all products
    async function fetchEddData(modelCodes) {
      await getZipcode();

      if (!modelCodes.length) {
        return {};
      }

      // Split into chunks
      const chunkSize = 10;
      const chunks = [];

      for (let i = 0; i < modelCodes.length; i += chunkSize) {
        chunks.push(modelCodes.slice(i, i + chunkSize));
      }

      const promises = chunks.map(chunk => {
        let productCodesParam = chunk.join(',');
        productCodesParam = encodeURIComponent(productCodesParam);

        return apis.getEDD(productCodesParam);
      });

      try {
        const eddResponses = await Promise.all(promises);

        // Merge all eddResponses into a single array
        const allProducts = eddResponses.flat();

        let normalizedData = utils.normalizeDeliveryData(allProducts);
        let bundleNormalizedData = {};

        if (state?.isBundlePage) {
          if (state.bundleMapping && Object.keys(state.bundleMapping).length > 0 && state.loadedProducts && state.loadedProducts.length > 0) {
            state.loadedProducts.forEach(bundleCode => {
              const bundleSkus = state.bundleMapping[bundleCode];
              const bundleEddInfo = bundleSkus.map(sku => normalizedData[sku]).filter(info => info).sort((a, b) => {
                if (!a.rawData.deliveryDate && !b.rawData.deliveryDate) return 0;
                if (!a.rawData.deliveryDate) return -1;
                if (!b.rawData.deliveryDate) return 1;
                return new Date(b.rawData.deliveryDate) - new Date(a.rawData.deliveryDate);
              });
              bundleNormalizedData[bundleCode] = bundleEddInfo && bundleEddInfo.length > 0 ? bundleEddInfo[0] : {};
            });

            normalizedData = bundleNormalizedData;
          }
        }

        if (state.isBundlePage) {
          state.deliveryInfo = {...state.deliveryInfo, ...normalizedData};
        } else {
          state.deliveryInfo = normalizedData;
        }

        return normalizedData;
      } catch (error) {
        console.error('EDD fetch error:', error);
        state.deliveryInfo = {};
        throw error;
      }
    }

    async function fetchAndUpdateEDD({ range, modelCodes }) {
      if(!state.showEddFilter) return;

      if (range === "ALL_PRODUCTS") {
        modelCodes = $('.pd21-product-card__delivery-wrap[data-modelcode]')
          .map(function () {
            return $(this).attr('data-modelcode');
          })
          .get()
          .filter(Boolean);
      }

      if (state?.isBundlePage) {
        modelCodes = modelCodes.flatMap((code) => {
          if (code.startsWith("F-")) {
            const bundleModelCodes = state.bundleMapping[code] || [];
            return [...bundleModelCodes];
          } else {
            return code;
          }
        });
      }

      const _modelCodes = state?.isBundlePage ? state.loadedProducts : modelCodes;

      try {
        await fetchEddData(modelCodes);

        _modelCodes.map(modelCode => {
          $(`.pd21-product-card__delivery-wrap[data-modelcode="${modelCode}"]`).each(function () {
            const $deliveryWrap = $(this);
            const modelCode = $deliveryWrap.data('modelcode');

            // Get delivery info for current SKU
            const deliveryInfo = state.deliveryInfo[modelCode];

            if (deliveryInfo?.eddMsg || deliveryInfo?.isNDD) {
              const deliveryHTML = utils.generateEddTemplate(deliveryInfo);
              $deliveryWrap.html(deliveryHTML).css('visibility', 'visible');
            } else {
              $deliveryWrap.empty().css('visibility', 'visible');
            }
          })
        })

        window.sg.components.Pd21ProductCard.alignCardHeights();

      } catch (error) {
        console.error('Failed to update EDD after filtering:', error);
        _modelCodes.forEach(modelCode => {
          $(`.pd21-product-card__delivery-wrap[data-modelcode="${modelCode}"]`).empty().css('visibility', 'visible');
        });
      }
      $(".pd21-product-finder__loading-container").removeClass("active");
    }

    async function validateInput(e) {
      const input = e.target;
      const inputValue = input.value.replace(/\D/g, ''); // remove all non-digits

      if (input.value !== inputValue) {
        input.value = inputValue; // update the input value only if it changed
      }

      const $inputValidateEl = $(".text-field-v2__validate");

      const isValid = inputValue.trim().length >= 5; // Check if length is 5 or more
      if (inputValue === '' || inputValue.length === 0) {
        $inputValidateEl.removeClass("active success error");
        $.removeCookie('HA-Deeplink-Zipcode', { path: '/' });
        utils.deleteCookie('tmktname', '/', '.samsung.com');
      }

      $inputValidateEl.removeClass("success error");

      if (inputValue.length > 0) {
        $inputValidateEl.addClass("active");
      } else {
        $inputValidateEl.removeClass("active");
      }

      if (isValid) {
        $inputValidateEl.removeClass("active error").addClass("success");

        // Ensure the new zip code is different from the current one
        if (state.zipCode !== inputValue) {
          $.cookie('HA-Deeplink-Zipcode', inputValue, {
            path: '/',
            domain: '.samsung.com',
          });

          // $.cookie('eddzipcode', inputValue, {
            // path: '/',
            // domain: '.samsung.com',
          // });

          state.zipCode = inputValue;

          try {
            let updateCartZipcodeRes = null;
            let validateZipcodeRes = null;

            $(".pd21-product-finder__loading-container").addClass("active");
            
            try {
              updateCartZipcodeRes = await apis.updateCartZipcode(inputValue);
            } catch (err) {
              console.error("updateCartZipcode failed", err);
            }

            try {
              validateZipcodeRes = await apis.validateZipcode(inputValue);
            } catch (err) {
              console.error("validateZipcode failed", err);
              throw new Error("Zipcode validation failed");
            }

            // if (validateZipcodeRes.decision !== "ACCEPT") { // Need to update failure case later
            //   throw new Error("Invalid zipcode");
            // }

            await fetchAndUpdateEDD({ range: "ALL_PRODUCTS" });
          } catch (error) {
            $inputValidateEl.removeClass("active success").addClass("error");
            utils.clearEddOnProductCards();
            console.error(error);
          } finally {
            $(".pd21-product-finder__loading-container").removeClass("active");
          }
        }
      }
    }

    function buildOptions(option, optionFor = '', index) {
      let template = "";

      let filterName = "Offers";

      if (optionFor === "inStorePickup") {
        filterName = "Shop";

        if (option) {
          option = {
            ...option,
            enabledFilter: ((categoryUtils.isMonitorPage() || categoryUtils.isHEPage() || categoryUtils.isMemoryStoragePage()) && state.inStorePickup?.enabledFilter) ? true : false,
          }
        } else {
          option = {
            name: "Store Pickup Eligible",
            checked: false,
            enabledFilter: false,
          }
        }
      } else if (optionFor === "fastShipping") {
        if (option) {
          option = {
            ...option
          }
        } else {
          option = {
            name: "Eligible for 3-Day Delivery",
            checked: false,
            enabledFilter: false,
          }
        }
      } else if (optionFor === "nextdayShipping") {
        if (option) {
          option = {
            ...option
          }
        } else {
          option = {
            name: "Eligible for next-day delivery",
            checked: false,
            enabledFilter: false,
          }
        }
      }

      const checkboxId = utils.generateCheckboxId(filterName, option.name, index);

      let optionTextMaxChars = state.isMobile ? 49 : 80;

      template += `
      <!-- Dropdown option -->
      <div class="checkbox-v3 pd21-filter__select">
        <input class="checkbox-v3__input" type="checkbox" name="filter-option-checkbox" id="${checkboxId}"
          ${option.checked ? 'checked' : '' } ${option.enabledFilter ? '' : 'disabled' }
          an-tr="pd21_product finder / filter-${pageTrack}-filter list-filter_and_sort" an-ca="filter and sort"
          an-ac="filter" an-la="filter:get it fast:${option.name}">
        <label class="checkbox-v3__label pd21-filter__select-option" data-filter="${utils.escapeHtml(filterName)}"
          data-filter-option="${utils.escapeHtml(option.name)}" for="${checkboxId}">
          <span class="checkbox-v3__label-box-wrap">
            <span class="checkbox-v3__label-box">
              <svg class="checkbox-v3__label-box-icon" focusable="false" aria-hidden="true">
                <use xlink:href="#done-bold" href="#done-bold"></use>
              </svg>
            </span>
          </span>
          <span class="checkbox-v3__label-text">${utils.truncateText(option.name, optionTextMaxChars)}</span>
          ${optionFor === "fastShipping" ? `<div class="pd21-filter__tooltip">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <path id="Icon_Regular_Information_Help" data-name="Icon / Regular / Information / Help"
                d="M4.632,14.571a7.609,7.609,0,1,1,2.952.6A7.56,7.56,0,0,1,4.632,14.571ZM4.956,1.364A6.772,6.772,0,1,0,7.583.834,6.726,6.726,0,0,0,4.956,1.364Zm1.961,9.553a.667.667,0,1,1,.667.667A.667.667,0,0,1,6.917,10.917Zm.25-1.667V9.007a2.885,2.885,0,0,1,.777-1.994,4.816,4.816,0,0,1,.348-.35l.2-.178.039-.038a1.334,1.334,0,1,0-2.275-1V5.5H5.417a2.167,2.167,0,1,1,3.741,1.49l-.041.042L9.042,7.1c-.127.118-.379.356-.476.465A2.063,2.063,0,0,0,8,8.941V9.25Z" />
            </svg>
            <button class="pd21-filter__tooltip-button" data-js-action="pd21TooltipOpen"><span class="hidden">Open
                Tooltip Layer</span></button>
            <div class="pd21-filter__tooltip-content hidden">
              <p class="pd21-filter__tooltip-text">Get it superfast with Samsung Select 3-day delivery. Shop
                select
                home appliances and we’ll rush your order for free. Order must be placed by 2:00pm EST for 3-day
                delivery. Limited to select ZIP Codes. Holiday blackout periods apply.*</p>
              <button class="pd21-filter__tooltip-close" data-js-action="pd21TooltipClose">
                <svg class="icon">
                  <use xlink:href="#cancel-close-regular" href="#cancel-close-regular"></use>
                </svg>
              </button>
            </div>
          </div>`: ""}
        </label>
      </div>
      `

      return template;
    }

    function eddFilters(data) {
      const offerMenu = data?.filters?.filter(m => m.name.trim().toLowerCase() === 'offers')
      let filterMenu = data?.filters;

      if (filterMenu && filterMenu.length > 0) {
        for (let menu of filterMenu) {
          let item = [];

          if (menu.filterValues && menu.filterValues.length > 0) {
            item = menu.filterValues.filter(i => {
              const title = i.name.toLowerCase();
              return title.indexOf('store pickup eligible') >= 0 || title.indexOf('in-store pickup') >= 0
            })
          }

          if (item.length > 0) {
            state.inStorePickup = item[0];
            break
          }
        }
      }

      if (offerMenu && offerMenu.length > 0 && offerMenu[0].filterValues && offerMenu[0].filterValues.length > 0) {
        const item = offerMenu[0].filterValues.filter(option => ~option.name.indexOf('3-Day Delivery'));
        if (item.length > 0) {
          state.fastShipping = item[0];
        }

        const item1 = offerMenu[0].filterValues.filter(option => ~option.name.indexOf('next-day delivery'));
        if (item1.length > 0) {
          state.nextdayShipping = item1[0];
        }
      }

      // 1. Store Pickup Eligible or In-store Pickup
      // 2. 3-Day Delivery
      // 3. next-day delivery

      return `
      <div class="pd21-filter__selector-item pd21-filter__selector-item--get-it-fast pd21-filter__selector-item--menu ${state.isEddDropdownOpen ? "pd21-filter__selector-item--show pd21-filter__selector-item--open" : ""}">
        <button class="pd21-filter__selector-item-cta">
          <span>Get it Fast</span>
          <svg class="icon">
            <use xlink:href="#open-down-regular" href="#open-down-regular"></use>
          </svg>
        </button>

        <div class="pd21-filter__text-field">
          <p class="pd21-filter__text-field-title">Deliver to</p>

          <div class="text-field-v2 text-field-v2__validate no-title no-icon ${state.zipCode.trim().length >= 5 ? "success" : ""}" data-comp-name="textFieldv2">
            <!---- <label class="text-field-v2__hint" for="">Enter zip code</label> ---->
            <div class="text-field-v2__input-wrap">
              <input placeholder="Enter zip code" class="text-field-v2__input text-field-v2__zipcode" id="" type="text" maxlength="5" autocomplete="off" value="${state.zipCode}">
            </div>

            <p class="text-field-v2__text error" aria-hidden="true">Please check your zip code.</p>

          </div>
          <button 
            class="pd21-filter__text-field-cta"
            data-js-action="pd21ToggleOptions"
            an-tr="pd21_product finder / filter-${pageTrack}-filter action-filter_and_sort"
            an-ca="filter and sort"
            an-ac="filter"
            an-la="filter:get it fast:zip code"
          >
            <svg class="icon">
              <use xlink:href="#open-down-regular" href="#open-down-regular"></use>
            </svg>
          </button>
        </div>
        <div class="pd21-filter__option scrollbar" style="max-height: none;">
          <div class="scrollbar__wrap">
            <div class="pd21-filter__option-list scrollbar__contents">
              ${["inStorePickup", "fastShipping", "nextdayShipping"].map((optionFor, index) => (
                buildOptions(state[optionFor], optionFor, index)
              )).join("")}
              <button class="cta cta--underline-v2 cta--black cta--icon pd21-filter__selector-view-more"
                data-text-more="${filterOptionsViewMoreText}" data-text-less="${filterOptionsViewLessText}">
                <span>${filterOptionsViewMoreText}</span>
                <svg class="icon" focusable="false" aria-hidden="true">
                  <use xlink:href="#open-down-bold" href="#open-down-bold"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="scrollbar-horizontal__track" style="display: none;">
            <div class="scrollbar-horizontal__track-content">
              <div class="scrollbar-horizontal__bar"></div>
            </div>
          </div>
          <div class="scrollbar-vertical__track">
            <div class="scrollbar-vertical__track-content">
              <div class="scrollbar-vertical__bar" style="height: 338.646px; transform: translate3d(0px, 0px, 0px);">
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    }

    return {
      eddFilters: eddFilters,
      validateInput: validateInput,
      fetchAndUpdateEDD: fetchAndUpdateEDD,
    };
  })($);

  // Attach to pd21Modules
  pd21Modules.EddFilters = EddFilters;

})(window.jQuery);
(() => {

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;
  const utils = pd21Modules.Utils;
  const compareBar = pd21Modules.CompareBar;
  const lazyLoad = window.sg.common.lazyLoad;
  const categoryUtils = pd21Modules.CategoryUtils;
  const apis = pd21Modules.ApiService;
  const { fetchAndUpdateEDD } = pd21Modules.EddFilters;
  const isEpp =  $('#eppFlag').val() === 'Y';
  let isExtendedContentsCardPosition =  $('#contentsCardPositionType').val() === 'extended';


  function productFinderGrid() {

		const pageTrack = $("#pfPageTrack").val();
    let pfQuickviewProduct = {};
    const alignSelectors = [
      '.pd21-product-card__title-wrap',
      '.pd21-product-card__rating-wrap',
      '.pd21-product-card__options',
      '.pd21-product-card__delivery-wrap',
      '.pd21-product-card__energy-star-label-wrap',
      '.pd21-product-card__price',
      '.pd21-product-card__seller',
      '.pd21-product-card__cta-wrap'
    ];

    let isNotNull = function (_str) {
      return !fnIsNull(_str) && _str != "null";
    };

    const escapeAttr = function (text) {
      let newText = text;
      if (newText) {
        newText = newText
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "\\&quot;")
          .replace(/'/g, "&#039;");
      }
      return newText;
    };

    const renderCards = async (data) => {
      if (data?.searchResults) {

        let chipExceptionHandledData = utils.chipExceptionHandler(data?.searchResults);
        let updatedResponse = utils.chipKeyProvider(chipExceptionHandledData)
        updatedResponse.forEach((product) => {
          product.chipOptions = utils.updateDisabledFlag(product.chipOptions)
        })

        state.productListData = data?.searchResults;
        state.loadedProducts = data?.searchResults?.map(_ => _.modelCode);
        data?.searchResults.forEach(product => {
          if (product && product.modelCode && product.modelCode.startsWith("F-")) {
            state.bundleMapping[product.modelCode] = product.bundleSkus?.map(bundle => bundle.modelCode) || [];
          }
        })
        state.chipBinderData = utils.reverseOtherChipOptions(updatedResponse);

        if (data?.hasMoreResults) {
          $('.pd21-product-finder__view-more').show();
        } else {
          $('.pd21-product-finder__view-more').hide();
        }

        state.pickContentUse = (state.selectedSortOption.code === 'recommended' &&
          state.productListData[0]?.globalFeaturedSortOrder?.pickYn === 'Y');

        let productGridTemplate = ''
        state.productListData.forEach((prod, idx) => {
          productGridTemplate += `
            <div class="pd21-product-card__item js-pfv2-product-card pd21-product-card__item--active" data-productidx=${idx}>
              ${productCard(prod, idx)}
            </div>
          `
        });

        $(".pd21-product-card__list").html(productGridTemplate);


        setContentsCard();
        alignCardHeights();
        productCardEventListener(true);

        if (!state.isFirstRender) { // Skip on first render
          requestAnimationFrame(() => {
            window.sg.components.Pd21ProductFinder.scrollTop();
          })
        }

        if (state.showEddFilter) {
          try {
            const products = data?.searchResults || [];
            const modelCodes = products.map((product => product.modelCode));

            await fetchAndUpdateEDD({ modelCodes });
          } catch (error) {
            console.error('Failed to update EDD:', error);
          }
        }
      }
    }

    const appendCards = async (data) => {
      if (data?.searchResults) {

        const products = data?.searchResults || [];
        const startIdx = state.productListData.length;

        let chipExceptionHandledData = utils.chipExceptionHandler(products);
        let updatedResponse = utils.chipKeyProvider(chipExceptionHandledData)
        updatedResponse.forEach((product) => {
          product.chipOptions = utils.updateDisabledFlag(product.chipOptions)
        })

        state.productListData = [...state.productListData, ...products]
        state.loadedProducts = products?.map(_ => _.modelCode);
        data?.searchResults.forEach(product => {
          if (product && product.modelCode && product.modelCode.startsWith("F-")) {
            state.bundleMapping[product.modelCode] = product.bundleSkus?.map(bundle => bundle.modelCode) || [];
          }
        })
        state.chipBinderData = [...state.chipBinderData, ...utils.reverseOtherChipOptions(utils.chipKeyProvider(updatedResponse))]

        const $viewMoreBtn = $('.pd21-product-finder__view-more');
        if (data?.hasMoreResults) {
          $viewMoreBtn.show();
        } else {
          $viewMoreBtn.hide();
        }

        let productGridTemplate = ''
        products.forEach((prod, idx) => {
          const actualIdx = startIdx + idx;
          productGridTemplate += `
            <div class="pd21-product-card__item js-pfv2-product-card pd21-product-card__item--active" data-productidx=${actualIdx}>
              ${productCard(prod, actualIdx)}
            </div>
          `
        });

        $(".pd21-product-card__list").append(productGridTemplate);


        setContentsCard();
        alignCardHeights();
        productCardEventListener(true);

        if (state.showEddFilter) {
          try {
            const products = data?.searchResults || [];
            const modelCodes = products.map((product => product.modelCode));

            await fetchAndUpdateEDD({ modelCodes });
          } catch (error) {
            console.error('Failed to update EDD:', error);
          }
        }
      }
    }

    const productCard = (product, productIdx) => {

      const is_HA_Page = categoryUtils.isHAPage();
      const is_DA_Page = categoryUtils.isHEPage() || categoryUtils.isHAPage();
      const is_VD_Page = categoryUtils.isMonitorPage() || categoryUtils.isMemoryStoragePage();
      const is_MX_page = categoryUtils.isMobilePage();
      const isAccessoriesPage = categoryUtils.isAccessoriesPage();
      const isBundlePage = categoryUtils.isBundlePage();

      const productBadgeBuild = () => {

        let badgeClass, badgeText;
        if ((product?.badgeDetails) && (product?.badgeDetails?.iconTitle)) {

          badgeText = product?.badgeDetails?.iconTitle;
          const normalizedText = badgeText.toLowerCase();

          badgeClass = " badge-icon--bg-color-teal";
          if (normalizedText === "new") badgeClass = " badge-icon--bg-color-blue";
          else if (normalizedText === "hot") badgeClass = " badge-icon--bg-color-red";
          else if (normalizedText === "best-seller" || normalizedText === "bestseller")
            badgeClass = " badge-icon--bg-color-orange";

          if (state.pickContentUse && normalizedText === "pick") badgeClass += " badge-icon--pick"
        }


        return `
           <div class="pd21-product-card__badge">
             <span class="badge-icon badge-icon--label-v2 ${badgeClass}"> ${badgeText ? utils.truncateText(badgeText, 18) : ""} </span>
           </div>
         `

      }

      const productImageBuild = () => {
        const galleryImage = product?.galleryImage || [];

        const productLink = product.mlpUrl || product.pdpURL || '';

        const imagesHtml = galleryImage.map(imageUrl => `
          <div class="swiper-slide image">
            <img class="image__preview lazy-load responsive-img"
                 data-desktop-src="${imageUrl}" 
                 data-mobile-src="${imageUrl}" 
                 alt="alt text" role="img" data-comp-name="image">
            <img class="image__main responsive-img lazy-load" 
                 data-desktop-src="${imageUrl}" 
                 data-mobile-src="${imageUrl}" 
                 alt="alt text" role="img" data-comp-name="image">
          </div>
        `).join("");

        return `
          <a
            class="pd21-product-card__image-cta js-click-feedback"
            href="${productLink}"
            data-feedback-param="${utils.escapeHtml(product.feedbackParam)}"
            an-tr="pd21_product finder / cards-${pageTrack}-link to pd-product_click"
            an-ca="product click"
            an-ac="pf product card"
            an-la="image click"
            data-modelcode=${product.modelCode}
            data-modelname=${product.modelName}
          >
            <div class="pd21-product-card__image-wrap">
              <div class="swiper-wrapper">
                ${imagesHtml}
              </div>
            </div>
          </a>
          <button 
            class="cta cta--underline-v2 cta--black pd21-product-card__quick-view pd21-product-card__quickview_btn"
            aria-label="Quick Look Galaxy S25 Ultra"
            an-tr="pd21_product finder / cards-${pageTrack}-quick view-option_click1"
            an-ca="option click"
            an-ac="pf product card"
            an-la="quick view"
          >
						Quick view
					</button>
        `;
      };


      const productTitleBuild = () => {

        let productName = "";
        if (is_HA_Page || isBundlePage) {
          if (
            product.productShortTitle &&
            product.productShortTitle !== null &&
            product.productShortTitle !== undefined &&
            product.productShortTitle.length > 0
          ) {
            productName = product.productShortTitle;
          } else {
            productName = product.name;
          }

        } else if (is_MX_page) {
          if (product.familyMktName) {
            productName = product.familyMktName;
          } else if (product.productDisplayName) {
            productName = product.productDisplayName;
          } else {
            productName = product.name;
          }

        } else {
          if (product.productShortTitle) {
            productName = product.productShortTitle;
          } else if (product.productDisplayName) {
            productName = product.productDisplayName;
          } else {
            productName = product.name;
          }
        }

        const productLink = product.mlpUrl || product.pdpURL || '';

        let featureTitleText = '';
        let vdSubTitleText = '';

        if ((is_HA_Page || isBundlePage) && product.productFeatureTitle && typeof product.productFeatureTitle === "string" && product.productFeatureTitle.length) {
          featureTitleText = product.productFeatureTitle;
        } else if (!is_HA_Page && !is_MX_page && product.productFeatureTitle && typeof product.productFeatureTitle === "string" && product.productFeatureTitle.length) {
          vdSubTitleText = product.productFeatureTitle;
        }

        return `
          <div class="pd21-product-card__name-wrap">
                <a
                  href="${productLink}"
                  class="pd21-product-card__name js-click-feedback"
                  data-feedback-param="${utils.escapeHtml(product.feedbackParam)}"
                  an-tr="pd21_product finder / cards-${pageTrack}-link to pd-product_click"
                  an-ca="product click"
                  an-ac="pf product card"
                  an-la="display name click"
                  data-modelcode=${product.modelCode}
                  data-modelname=${product.modelName}
                >${utils.truncateText(productName, 59)}</a>
                <span class="pd21-product-card__name-tooltip">${productName}</span>
          </div>

          ${is_HA_Page || isBundlePage ? `<div class="pd21-product-card__feature-title-wrap">
            <div class="pd21-product-card__feature-title">
              <p class="pd21-product-card__feature-title-text">${featureTitleText}</p>
            </div>
          </div>` : ''}

          ${vdSubTitleText ? `<div class="pd21-product-card__feature-title-wrap">
            <div class="pd21-product-card__feature-title">
              <p class="pd21-product-card__feature-title-text">${vdSubTitleText}</p>
            </div>
          </div>` : ''}
        `
      }

      const productReviewsBuild = () => {


        if (product.reviewRating === 0) return "";
        const liteMode = state.isMobile;
        let starHtml = ''
        rating = Number(product.reviewRating);
        const starCounts = 5;
        Array.from({ length: starCounts }).forEach((val, idx) => {
          const diff = rating - idx;
          const percentage = diff > 1 ? 1 : (diff > 0 ? diff : 0);
          starHtml += `<span id="${idx}" class="rating__star-item"><span class="rating__star-empty"></span><span class="rating__star-filled" style="width: ${percentage * 100}%;"></span></span>`
        });

        return `
                <span class="rating">
                  <span class="rating__inner">
                    <span class="rating__star-list">
                      ${starHtml}
                    </span>
                    <strong class="rating__point"><span class="hidden">Product Ratings : </span><span>${Number(product.reviewRating).toFixed(1)}</span></strong>
                    <em class="rating__review-count">(<span class="hidden">Number of Ratings :</span><span>${product.numberOfReviews ? utils.countGreaterThan(product.numberOfReviews, 4) : 0}</span>)</em>
                  </span>
                </span>
              `
      }

      const productReviewsTooltipBuild = () => {
        if (product.reviewRating === 0) return "";

        let reviewUrl = '/' + siteCode + '/common/review/' + product.modelCode + '/';
        if (isNotNull(product.linkUrlReview)) {
          reviewUrl = product.linkUrlReview;
        }

        return `
        <button class="pd21-tooltip__button" data-modelcode="${product.modelCode}" data-js-action="pd21TooltipShow"><span class="hidden">Open Tooltip Layer</span></button>
        <div class="pd21-tooltip__layer" tabindex="-1" data-js-action="pd21TooltipLayer">
          <p class="pd21-tooltip__title">${Granite.I18n.get("Average Customer Ratings")}</p>
          <div class="pd21-tooltip__rating-list"></div>
          <a class="pd21-tooltip__link" href="${reviewUrl}">${Granite.I18n.get("See customer reviews")}</a>
          <button class="pd21-tooltip__close" data-js-action="pd21TooltipHide"><span class="hidden">Close Tooltip Layer</span></button>
        </div>
        `
      }


      const productFamilyOptnsBuild = () => {

        const modelCode = product.modelCode;
        const groupId = product.group_id;

        const colorChipData = state.chipBinderData[productIdx].chipOptions?.filter((el) => el.optionNameEng?.toLowerCase() == "color");
        const otherChipData = state.chipBinderData[productIdx].chipOptions?.filter((el) => el.optionNameEng?.toLowerCase() !== "color");

        if (!colorChipData.length && !otherChipData.length) return "";
        const chosenColorLabel = colorChipData[0]?.optionValues.filter((el) => el.checked);

        const renderColorChips = () => {
          const colorChipOptionValues = colorChipData[0]?.optionValues || [];
          let colorTooltipText = ''

          if (!colorChipOptionValues.length) return "";
          colorTooltipText = 'Color: '
          const chips = colorChipOptionValues
            .map((optn) => {
              colorTooltipText += `${optn.optionValue}, `

              return `
              <div 
             class="${optn.checked ? "is-checked" : ""} ${optn.disable ? "is-disabled" : ""} option-selector-v2__swiper-slide js-pfv2-product-fmychip" 
             role="listitem"
             data-modeli="${modelCode}" 
             data-chip-code="${optn.optionCode}" 
             data-chip-value="${optn.optionValue}"
                data-group-id="${groupId}">
                <button 
                  type="button" 
                  class="option-selector-v2__color"
                  an-tr="pd21_product finder / cards-${pageTrack}-option-option_click"
                  an-ca="option click"
                  an-ac="pf product card"
                  an-la="${colorChipData[0]?.optionName}:${optn.optionValue}"
                  data-modelcode=${product.modelCode}
                  data-modelname=${product.modelName}
                >
                  <span class="option-selector-v2__color-code" style="background-color: ${optn.optionCode}">
                    <span class="hidden">${optn.optionValue}</span>
                  </span>
                </button>
              </div>
              `
            })
            .join("");

          colorTooltipText = colorTooltipText.replace(/,\s*$/, "");
          let chosenColorLabelMaxChars = state.isMobile ? 20 : 36;

          return `
          <div class="option-selector-v2__color-name">
            <span>${utils.truncateText(chosenColorLabel[0]?.optionValue || "", chosenColorLabelMaxChars)}</span>
            <div class="pd21-product-card__options-tooltip">
              ${colorTooltipText}
              <button class="pd21-product-card__options-tooltip-close">
                <svg class="icon">
                  <use xlink:href="#cancel-close-regular" href="#cancel-close-regular"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="option-selector-v2__wrap option-selector-v2__wrap--color-chip" data-global-text='{ "selected" : "selected" }'>
            <div class="option-selector-v2__swiper">
              <div class="option-selector-v2__swiper-container">
                <button 
                  class="option-selector-v2__swiper--color-option-left" 
                  an-tr="pd21_product finder / cards-${pageTrack}-arrow-indication"
                  an-ca="indication"
                  an-ac="carousel"
                  an-la="carousel:arrow:left"
                ></button>
                <div class="option-selector-v2__swiper-wrapper" role="list" data-chip-type="${colorChipData[0]?.optionNameEng}">
                  ${chips}
                </div>
                <button 
                  class="option-selector-v2__swiper--color-option-right"
                  an-tr="pd21_product finder / cards-${pageTrack}-arrow-indication"
                  an-ca="indication"
                  an-ac="carousel"
                  an-la="carousel:arrow:right"
                ></button>
              </div>
            </div>
          </div>
          `;
        };

        const renderOtherChips = () => {
          if (!otherChipData.length) return "";

          return otherChipData
            .map(chipData => {
              const options = (chipData.optionValues || [])
                .map(optn => `
            <div 
                 class="${optn.checked ? "is-checked" : ""} ${optn.disable ? "is-disabled" : ""} option-selector-v2__swiper-slide js-pfv2-product-fmychip" 
                 role="listitem"
                 data-modeli="${modelCode}" 
                 data-group-id="${groupId}" 
                 data-chip-code="${escapeAttr(optn.optionValue.toLowerCase().replace(/"/ig, ""))}">
              <button 
                type="button" class="option-selector-v2__size"
                an-tr="pd21_product finder / cards-${pageTrack}-option-option_click"
                an-ca="option click"
                an-ac="pf product card"
                an-la="${chipData.optionName}:${optn.optionValue}"    
                data-modelcode=${product.modelCode}
                data-modelname=${product.modelName}
              >
                <span class="option-selector-v2__size-text">${utils.truncateText(optn.optionValue, 15)}</span>
                <span class="blind">selected</span>
              </button>
            </div>
          `)
                .join("");

              return `
          <div class="option-selector-v2__wrap option-selector-v2__wrap--capacity" data-global-text='{ "selected" : "selected" }'>
            <div class="option-selector-v2__swiper">
              <div class="option-selector-v2__swiper-container">
                <button 
                  class="option-selector-v2__swiper--other-option-left" 
                  an-tr="pd21_product finder / cards-${pageTrack}-arrow-indication"
                  an-ca="indication"
                  an-ac="carousel"
                  an-la="carousel:arrow:left"
                ></button>
                <div class="option-selector-v2__swiper-wrapper" role="list" data-chip-type="${chipData.optionNameEng}">
                  ${options}
                </div>
                <button 
                  class="option-selector-v2__swiper--other-option-right"
                  an-tr="pd21_product finder / cards-${pageTrack}-arrow-indication"
                  an-ca="indication"
                  an-ac="carousel"
                  an-la="carousel:arrow:right"
                ></button>
              </div>
            </div>
          </div>
        `;
            })
            .join("");
        };

        const colorChipHTML = colorChipData.length ? renderColorChips() : '';
        const otherChipHTML = otherChipData.length ? renderOtherChips() : '';

        return `
      <div class="option-selector-v2 option-selector-v2__color-text">
        ${colorChipHTML + otherChipHTML}
      </div>
  `;
      };

      const productEDDBuild = () => {
        return ``
      }

      const productEnergyStarBuild = () => {

        if(!is_VD_Page && !is_DA_Page) return ""; 

        let content = '';
        if (product?.energyStarFlg && product?.energyStarFlg === 'Y') {
          content = `
              <div class="pd21-product-card__energy-star-label">
                <p class="pd21-product-card__energy-star-label-text">Energy Star Certified</p>
                <img src="https://image-us.samsung.com/us/b2c_pf/badge/v2/energy-star-logo@2x.png" alt="Alt text">
              </div>
          `
        }

        return content;
      }

      const productPricingBuild = () => {

        const saveFlag = product.sale_price_currency && product.msrp_price_currency && product.sale_price_currency != product.msrp_price_currency;
        const currentPrice = product.sale_price_currency ? product.sale_price_currency : "";
        const monthlyPrice = product.monthly_price_currency ? product.monthly_price_currency : "";
        const msrpPrice = product.msrp_price_currency ? product.msrp_price_currency : "";
        const months = product.monthly_price ? Math.round(product.sale_price / product.monthly_price) : 0;
        const savePrice = Number(product.msrp_price - product.sale_price).toFixed(2);

        return `
              <div class="price-ux__wrap price-ux__wrap--ux-v2">
                ${monthlyPrice ? `<div class="price-ux__price-current"><strong>From ${utils.truncateText(currentPrice, 23)} or ${utils.truncateText(monthlyPrice, 23)}/mo for ${months}mo</strong></div>` : `<div class="price-ux__price-current"><strong>${utils.truncateText(currentPrice, 23)}</strong></div>`}
                ${saveFlag ? `<p class="price-ux__price-save">
                            <span class="hidden">Save Price: </span>
                            <em><span class="price-ux__price-save-was">${utils.truncateText(msrpPrice, 23)}</span> <span class="price-ux__price-save-highlight">Save $${utils.truncateText(savePrice, 18)}</span></em>
                          </p>` : ""
                }
              </div>
        `
      }

      const productSellerInfoBuild = () => {

        const sellerInfo = product?.sellerInfo;
        if (!isAccessoriesPage || sellerInfo?.UseYN !== 'Y' || !sellerInfo?.Seller) return '';

        return `<div class="pd21-product-card__seller">
                  <p>
                    ${utils.truncateText('Seller:', 12)}
                    <span>${utils.truncateText(sellerInfo.Seller, 15)}</span>
                  </p>
                </div>`;
      };

      const productCTABuild = () => {

        const modelCode = product.modelCode;
        const groupId = product.group_id;
        
        let buyLink = product.consumerUrl || product.pdpURL || '';
        let ctaText = '';
        let isNotifyMe = false;

        let wtbUrl = product.wtbUrl;
        if (!wtbUrl) {
          wtbUrl = utils.generateWtbUrl(product?.consumerUrl, product?.modelCode);
        }

        if (product?.ecomFlag === 'Y') {
          switch (product?.stockFlag) {
            case 'Y':
            case 'B':
              ctaText = 'Buy';
              break;
            case 'P':
              ctaText = 'Pre-order';
              break;
            case 'R':
              ctaText = 'Reserve now';
              break;
            case 'E':
              ctaText = 'Notify me';
              isNotifyMe = true;
              break;
            case 'N':
              if (isEpp) {
                ctaText = 'Buy';
              } else {
                ctaText = 'Notify me';
                isNotifyMe = true;
              }
              break;
            default:
              if (isEpp) {
                ctaText = 'Buy';
              } else {
                ctaText = 'Buy';
              }
          }
        } else {
          if (isEpp) {
            ctaText = 'Buy';
          } else {
            buyLink = wtbUrl;
            ctaText = 'Where to buy';
          }
        }


        const ctaTextMaxChars = state.isMobile ? 26 : 28;
        let learnMoreUrl = '';
        if (product.mlpUrl) {
          learnMoreUrl = product.mlpUrl;
        } else if (product.pdpURL) {
          const anchor = is_MX_page ? '' : is_HA_Page ? '#benefits' : '#highlights';
          learnMoreUrl = product.pdpURL + anchor;
        } else {
          learnMoreUrl = '';
        }

        return `
              <div class="pd21-product-card__cta">
                <div class="pd21-product-card__cta-container">

                  ${isNotifyMe ? `
                  <button 
                    class="cta cta--contained cta--black js-cta-stock js-click-feedback"
                    data-feedback-param="${utils.escapeHtml(product.feedbackParam)}
                    an-tr="pd21_product finder / cards-${pageTrack}-cta-buy_cta2"
                    an-ca="buy cta"
                    an-ac="${ctaText}"
                    an-la="pf product card:${ctaText}"
                    data-modelcode=${product.modelCode}
                    data-modelname=${product.modelName}
                  >
                    ${utils.truncateText(ctaText, ctaTextMaxChars)}
                  </button>
                ` : `
                  <a class="cta__link js-click-feedback" href="${buyLink}" data-feedback-param="${utils.escapeHtml(product.feedbackParam)}">
                    <button 
                      class="cta cta--contained cta--black"
                      an-tr="pd21_product finder / cards-${pageTrack}-cta-buy_cta2"
                      an-ca="buy cta"
                      an-ac="${ctaText}"
                      an-la="pf product card:${ctaText}"
                      data-modelcode=${product.modelCode}
                      data-modelname=${product.modelName}
                    >
                      ${utils.truncateText(ctaText, ctaTextMaxChars)}
                    </button>
                  </a>
                `}
                  <a class="cta__link js-click-feedback" href="${learnMoreUrl}" data-feedback-param="${utils.escapeHtml(product.feedbackParam)}">
                    <button 
                      class="cta cta--outlined cta--black"
                      an-tr="pd21_product finder / cards-${pageTrack}-link to pd-product_click"
                      an-ca="product click"
                      an-ac="pf product card"
                      an-la="learn more click"
                      data-modelcode=${product.modelCode}
                      data-modelname=${product.modelName}
                    >
                      Learn more
                    </button>
                  </a>
                </div>
                <div class="checkbox-v3 ${state.searchTotalCount < 2 ? 'checkbox-v3--hidden' : ''}">
                  <input 
                    class="checkbox-v3__input pd21-product-card__compare-checkbox"
                    type="checkbox" name="checkbox" id="${modelCode}"
                    ${state.compareSelectedItems?.some(item => item.modelCode === product.modelCode) ? 'checked' : ''}
                    data-model-code="${modelCode}" data-productidx="${productIdx}"
                    data-group-id="${groupId}"
                    data-img-src="${product.images?.smImage}"
                    an-tr="pd21_product finder / cards-${pageTrack}-compare-content_click1"
                    an-ca="content click"
                    an-ac="feature"
                    an-la="pf product card:compare"
                    data-modelcode=${product.modelCode}
                    data-modelname=${product.modelName}
                  >
                  <label class="checkbox-v3__label" for="${modelCode}">
                    <span class="checkbox-v3__label-box-wrap">
                      <span class="checkbox-v3__label-box">
                        <svg class="checkbox-v3__label-box-icon" focusable="false" aria-hidden="true">
                          <use xlink:href="#done-bold" href="#done-bold"></use>
                        </svg>
                      </span>
                    </span>
                    <span class="checkbox-v3__label-text">
                      Compare
                    </span>
                  </label>
                </div>
              </div>
        `
      }



      const productCardTemplate = `
        <!-- card badge -->
        <div class="pd21-product-card__badge-wrap">
          ${productBadgeBuild()}
        </div>
        <!-- card badge end -->

        <!-- card image -->
        <div class="pd21-product-card__image">
          ${productImageBuild()}
        </div>
        <!-- card image end -->
        
        <!-- card title -->
        <div class="pd21-product-card__title-wrap">
          ${productTitleBuild()}
        </div>
        <!-- card title end -->

        <!-- card review -->
      <div class="pd21-product-card__rating-wrap">
        <div class="pd21-product-card__rating-inner">
          <a 
            href="${product.linkUrlReview}"
            class="pd21-product-card__rating js-click-feedback"
            data-feedback-param="${utils.escapeHtml(product.feedbackParam)}"
            an-tr="pd21_product finder / cards-${pageTrack}-review-review2"
            an-ca="review"
            an-ac="pf product card"
            an-la="read review:${product.reviewRating}"
            data-modelcode=${product.modelCode}
            data-modelname=${product.modelName}
          >
            ${productReviewsBuild()}
          </a>
          <div class="pd21-tooltip__container pd21-tooltip__container--rating" data-js-action="pd21TooltipContainer" data-tooltip-hover="true">
            ${productReviewsTooltipBuild()}
          </div>
          <!-- card review end -->
      </div>
    </div>

        <!-- card family option -->
        <div class="pd21-product-card__options">
          ${productFamilyOptnsBuild()}
        </div>
        <!-- card family option end -->

        <!-- card EDD -->
        <div class="pd21-product-card__delivery-wrap" data-modelcode=${product.modelCode}>
          ${productEDDBuild()}
        </div>
        <!-- card EDD end -->

        <!-- card Energy Star -->
          <div class="pd21-product-card__energy-star-label-wrap">
          ${productEnergyStarBuild()}
          </div>
        <!-- card Energy Star end -->

        <!-- card pricing -->
        <div class="pd21-product-card__price">
          ${productPricingBuild()}
        </div>
        <!-- card pricing end -->

        <!-- card seller info end -->
          ${productSellerInfoBuild()}
        <!-- card seller info end -->

        <!-- card CTA -->
        <div class="pd21-product-card__cta-wrap">
          ${productCTABuild()}
        </div>
        <!-- card CTA end -->
      `

      return productCardTemplate;
    }

    const getPromoCardsPositions = (
      isMobile,
      productsData = [],
    ) => {
      const productCount = productsData.length;
      const positions = [];

      let extendedPositioningOffset = (state.pickContentUse || isExtendedContentsCardPosition) ? 4 : 0;
      if (isMobile) {
        if (productCount === 0) {
          return positions;
        }

        if (productCount >= 1 && productCount <= (1 + extendedPositioningOffset)) {
          positions.push(productCount);
        } else if (productCount === (2 + extendedPositioningOffset)) {
          positions.push(2 + extendedPositioningOffset);
        } else if (productCount >= (3 + extendedPositioningOffset) && productCount <= (7 + extendedPositioningOffset)) {
          positions.push(2 + extendedPositioningOffset);
          positions.push(productCount + 1);
        } else if (productCount === (8 + extendedPositioningOffset)) {
          positions.push(2 + extendedPositioningOffset);
          positions.push(9 + extendedPositioningOffset);
        } else if (productCount >= (9 + extendedPositioningOffset) && productCount <= (13 + extendedPositioningOffset)) {
          positions.push(2 + extendedPositioningOffset);
          positions.push(9 + extendedPositioningOffset);
          positions.push(productCount + 2);
        } else if (productCount >= (14 + extendedPositioningOffset)) {
          positions.push(2 + extendedPositioningOffset);
          positions.push(9 + extendedPositioningOffset);
          positions.push(16 + extendedPositioningOffset);
        }
      } else {
        if (productCount === 0) {
          return positions;
        }

        if (productCount >= 1 && productCount <= (2 + extendedPositioningOffset)) {
          positions.push(productCount);
        } else if (productCount === (3 + extendedPositioningOffset)) {
          positions.push(3 + extendedPositioningOffset);
        } else if (productCount >= (4 + extendedPositioningOffset) && productCount <= (9 + extendedPositioningOffset)) {
          positions.push(3 + extendedPositioningOffset);
          positions.push(productCount + 1);
        } else if (productCount === (10 + extendedPositioningOffset)) {
          positions.push(3 + extendedPositioningOffset);
          positions.push(11 + extendedPositioningOffset);
        } else if (productCount >= (11 + extendedPositioningOffset) && productCount <= (16 + extendedPositioningOffset)) {
          positions.push(3 + extendedPositioningOffset);
          positions.push(11 + extendedPositioningOffset);
          positions.push(productCount + 2);
        } else if (productCount >= (17 + extendedPositioningOffset)) {
          positions.push(3 + extendedPositioningOffset);
          positions.push(11 + extendedPositioningOffset);
          positions.push(19 + extendedPositioningOffset);
        }
      }

      return positions;
    };


    function alignCardHeights() {

      let cardSelector = '.pd21-product-card__item';
      let colsPerRow;
      if (state.isMobile) {
        colsPerRow = 2;
      } else {
        colsPerRow = 4;
      }

      const allCards = Array.from(document.querySelectorAll(cardSelector));
      if (!allCards.length) return;

      alignSelectors.forEach(sel => {
        allCards.forEach(card => {
          const el = card.querySelector(sel);
          if (el) el.style.height = 'auto';
        });
      });

      const rows = [];
      let currentRow = [];

      allCards.forEach((card, idx) => {
        const isPromo = card.classList.contains('pd21-product-card__banner');

        if (isPromo) {
          if (currentRow.length) {
            rows.push(currentRow);
            currentRow = [];
          }
          return;
        }

        currentRow.push(card);

        if (currentRow.length === colsPerRow) {
          rows.push(currentRow);
          currentRow = [];
        }
      });

      if (currentRow.length) {
        rows.push(currentRow);
      }

      rows.forEach(rowCards => {
        alignSelectors.forEach(sel => {
          const elements = rowCards.map(card => card.querySelector(sel)).filter(Boolean);
          if (!elements.length) return;

          const maxHeight = Math.max(...elements.map(el => el.offsetHeight));

          elements.forEach(el => {
            el.style.height = maxHeight + 'px';
            el.style.marginBottom = maxHeight > 0 ? '12px' : '0px';
          });
        });
      });
    }

    const setContentsCard = function () {

      let $contentsCardWrap = $("#contentsCardWrap");
      let $contentCardItemList = $contentsCardWrap.find(".pd21-product-card__item");
      let $contentWrap = $(".js-pfv2-content-wrap");
      const positions = getPromoCardsPositions(state.isMobile, [...state.productListData]);

      //기존 카드 삭제
      $contentWrap.find(".pd21-product-card__item.pd21-product-card__banner").remove();
      let $cardItemList = $contentWrap.find(".pd21-product-card__item");
      const promoCards = [...$contentCardItemList];

      let insertedCount = 0;
      // Insert cards at specified positions
      positions.forEach((pos, index) => {
        
        $cardItemList = $contentWrap.find(".pd21-product-card__item");

        if (promoCards[index] && pos <= $cardItemList.length) {

          const $item = $(promoCards[index]).clone();
          if(pos === $cardItemList.length) {
            $contentWrap.append($item);
          } else {
            $item.insertBefore($cardItemList.eq(pos));
          }
          insertedCount++;
        }
      });

      state.renderedMarketingCardsCount = insertedCount;
    }

const productCardEventListener = function (isInitialRender = false, reRenderedIdx = -1) {
      const $fmyChipEl = $('.js-pfv2-product-fmychip');

      const $cardTitleEl = $('.pd21-product-card__name');
      const $productDetail = $('.js-pfv2-product-details');
      const $colorOptnSwiperContainer = $('.option-selector-v2__swiper-container');
      const $colorOptnNameEl = $('.option-selector-v2__color-name');
      const $colorTooltipCloseBtn = $('.pd21-product-card__options-tooltip-close');

      $('.pd21-product-card__list').off('click.feedbackAPI', '.pd21-product-card__item .js-click-feedback');
      $('.pd21-product-card__list').on('click.feedbackAPI', '.pd21-product-card__item .js-click-feedback', function (e) {
        const feedbackParam = $(this).data('feedback-param');
        apis.clickFeedbackAPI(feedbackParam);
      });

      $fmyChipEl.off("click.finder").on("click.finder", function (e) {

        const $optionInputEl = $(this);
        const $targetContentEl = $optionInputEl.closest('.js-pfv2-product-card');
        const $parentEl = $optionInputEl.parent();

        const productIdx = $targetContentEl.data("productidx");

        const chipCode = $optionInputEl.data("chip-code");
        const chipValue = $optionInputEl.data("chip-value");
        const modelIdx = $optionInputEl.data("modeli");
        const chipType = $parentEl.data("chip-type");
        const groupId = $optionInputEl.data("group-id");



        setTimeout(function () {
          if (modelIdx) {

            let updatedResponse = [...state.chipBinderData];
            updatedResponse[productIdx].chipOptions.forEach((chipOption) => {
              if ((chipOption.optionNameEng).toLowerCase() == chipType.toLowerCase()) {

                chipOption.optionValues = chipOption.optionValues.map(
                  (option) => {

                    return {
                      ...option,
                      checked: (chipType.toLowerCase() == 'color' ? (option.optionCode === chipCode && option.optionValue === chipValue) : option.optionValue.toLowerCase().replace(/"/ig, "") == chipCode),
                    }
                  }
                );
              }
            });

            const otherChipData = state.chipBinderData[productIdx].chipOptions?.filter(el => {
              const name = el.optionNameEng?.toLowerCase();
              return chipType.toLowerCase() === "color" ? name !== "color" : name === "color";
            });

            const collectedMappers = [];

            const updatedSelectedChip = updatedResponse[
              productIdx
            ].chipOptions?.filter((el) => (chipType.toLowerCase() == 'color' ? el.optionNameEng.toLowerCase() == "color" : el.optionNameEng.toLowerCase() !== "color"));

            updatedSelectedChip.forEach((updatedSelectedChipElem) => {
              updatedSelectedChipElem.optionValues.map((option) => {
                if (option.checked) {
                  collectedMappers.push(option.optionValue);
                }
              });
            });

            if (chipType.toLowerCase() == 'color') {
              otherChipData.forEach((otherChipDataOption) => {
                otherChipDataOption.optionValues.map((option) => {
                  if (option.checked) {
                    collectedMappers.push(option.optionValue);
                  }
                });
              });
            } else {
              otherChipData[0]?.optionValues.map((el) => {
                if (el.checked) {
                  collectedMappers.push(el.optionValue);
                }
              });
            }

            const clickedProductIs = state.chipBinderData[productIdx];

            const matchingParent = clickedProductIs.groupedProductList.find(
              (obj) =>
                collectedMappers.every((mapper) => {
                  return obj.chips.some((chipElement) => {
                    return chipElement.fmyChipName == mapper;
                  });
                })
            );

            const updatedDynamicParts = [...state.productListData];

            if (matchingParent) {
              updatedDynamicParts[productIdx] = matchingParent;
            }

            updatedResponse[productIdx].chipOptions = utils.updateDisabledFlag(updatedResponse[productIdx].chipOptions)

            // Remove from compare bar if already present with same groupId
            const groupIdExists = state.compareSelectedItems.some(item => item.groupId === groupId);
            if (groupIdExists) {
              const modelcode = modelIdx;
              compareBar.productCompareRemoveHandler(modelcode);
            }

            const currentEddHtml = $targetContentEl.find('.pd21-product-card__delivery-wrap').html();

            $targetContentEl.html(productCard(updatedDynamicParts[productIdx], productIdx));
            state.productListData[productIdx] = {...state.productListData[productIdx], ...updatedDynamicParts[productIdx]}

            if (currentEddHtml) {
              $targetContentEl.find('.pd21-product-card__delivery-wrap').html(currentEddHtml).css('visibility', 'hidden');
            }

            const modelCode = updatedDynamicParts[productIdx]?.modelCode;

            const $imgEl = $targetContentEl.find('.pd21-product-card__image-wrap');
            if (lazyLoad && $imgEl.length) {
              lazyLoad.forceLoad($imgEl[0]);
            }

            alignCardHeights();
            productCardEventListener(false, productIdx);

            if (modelCode) {
              // Get delivery info for current SKU
              fetchAndUpdateEDD({ modelCodes: [modelCode] });
              $(".pd21-product-finder__loading-container").removeClass("active");
            }
          }
        }, 300);

      });

      // Truncate Product titles
      $cardTitleEl.each(function () {
        const $el = $(this);
        const cardTitleText = $el.text().trim();
        const truncated = utils.truncateText(cardTitleText, 59);
        $el.text(truncated);
      });

      // Product Title Tooltip logic
      $cardTitleEl.on({
        mouseover: function () {

          if ($(this).text().trim().length >= 59 && !state.isMobile) {
            $(this).siblings('.pd21-product-card__name-tooltip').show();
          }
        },
        mouseout: function () {
          $(this).siblings('.pd21-product-card__name-tooltip').hide();
        }
      });

      // Product Detail Tooltip logic
      $productDetail.on({
        mouseover: function () {
          $(this).siblings('.pd21-product-card__details-tooltip').show();
        },
        mouseout: function () {
          $(this).siblings('.pd21-product-card__details-tooltip').hide();
        }
      });

      // Color Names Tooltip logic
      $colorOptnNameEl.each(function () {
        const $parent = $(this);
        const $trigger = $parent.children('span'); // only the direct span
        const $tooltip = $parent.find('.pd21-product-card__options-tooltip');

        $trigger.on('mouseenter', function () {
          $tooltip.show();
        });

        $trigger.on('mouseleave', function () {
          $tooltip.hide();
        });

        $tooltip.find('.pd21-product-card__options-tooltip-close').on('click', function (e) {
          e.stopPropagation();
          $tooltip.hide();
        });
      });

      // Product Title Tooltip Close logic
      $colorTooltipCloseBtn.on("click.finder", function (e) {
        $(this).parent().hide();
      })

      $colorOptnSwiperContainer.each(function () {
        const $swiperContainer = $(this);
        const $swiperWrapper = $swiperContainer.find('.option-selector-v2__swiper-wrapper');
        const $slides = $swiperWrapper.find('.option-selector-v2__swiper-slide');

        const slideWidth = $slides.first().outerWidth(true) || 1;
        const slidePadding = ($slides.first().outerWidth(true) - $slides.first().outerWidth(false)) || 8;
        const totalSlides = $slides.length;

        const $btnLeft = $swiperContainer.find('.option-selector-v2__swiper--other-option-left, .option-selector-v2__swiper--color-option-left');
        const $btnRight = $swiperContainer.find('.option-selector-v2__swiper--other-option-right, .option-selector-v2__swiper--color-option-right');

        const buttonsWidth = state.isMobile ? ($btnRight.outerWidth(true) || 0) : 0;

        const containerWidth = $swiperContainer.width() - buttonsWidth;

        const visibleCount = Math.max(1, Math.floor((containerWidth + slidePadding) / slideWidth));

        const maxIndex = Math.max(totalSlides - visibleCount, 0);

        let currentIndex = 0;

        if (totalSlides <= visibleCount) {
          $btnLeft.hide();
          $btnRight.hide();
          $swiperWrapper.css({ transition: 'none', transform: 'translate3d(0px, 0, 0)' });
          return;
        }

        const cardIdx = parseInt($swiperWrapper.closest('.js-pfv2-product-card').data('productidx'));
        const shouldScrollToActive = isInitialRender || cardIdx === reRenderedIdx;

        function updateSlidePosition(animate = true) {
          const translateX = -currentIndex * slideWidth;
          $swiperWrapper.css({
            transition: animate ? 'transform 0.3s ease' : 'none',
            transform: `translate3d(${translateX}px, 0, 0)`
          });

          $btnLeft.toggle(currentIndex > 0);
          $btnRight.toggle(currentIndex < maxIndex);
        }

        if (shouldScrollToActive) {
          requestAnimationFrame(function () {
            const freshSlideWidth = $slides.first().outerWidth(true) || 1;
            const freshSlidePadding = ($slides.first().outerWidth(true) - $slides.first().outerWidth(false)) || 8;
            const freshBtnWidth = state.isMobile ? ($btnRight.outerWidth(true) || 0) : 0;
            const freshContainerWidth = $swiperContainer.width() - freshBtnWidth;
            const freshVisibleCount = Math.max(1, Math.floor((freshContainerWidth + freshSlidePadding) / freshSlideWidth));
            const freshMaxIndex = Math.max(totalSlides - freshVisibleCount, 0);

            const $checkedSlide = $swiperWrapper.find('.is-checked');
            if ($checkedSlide.length) {
              const checkedIndex = $slides.index($checkedSlide);
              const idealIndex = checkedIndex - (freshVisibleCount - 1);
              currentIndex = Math.min(Math.max(idealIndex, 0), freshMaxIndex);
            }

            const translateX = -currentIndex * freshSlideWidth;
            $swiperWrapper.css({
              transition: 'none',
              transform: `translate3d(${translateX}px, 0, 0)`
            });
            $btnLeft.toggle(currentIndex > 0);
            $btnRight.toggle(currentIndex < freshMaxIndex);
          });
        } else {
          const currentTransform = $swiperWrapper.css('transform');
          const matrixMatch = currentTransform && currentTransform !== 'none' ? parseFloat(currentTransform.split(',')[4]) || 0 : 0;
          const currentTranslate = Math.abs(matrixMatch);
          currentIndex = Math.min(Math.max(Math.round(currentTranslate / slideWidth), 0), maxIndex);
          $btnLeft.toggle(currentIndex > 0);
          $btnRight.toggle(currentIndex < maxIndex);
        }

        $btnRight.on('click', () => {
          if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlidePosition();
          }
        });

        $btnLeft.on('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateSlidePosition();
          }
        });

        let startX = 0;
        let startTranslateX = 0;
        let isDragging = false;

        $swiperWrapper[0].style.touchAction = 'pan-y';

        $swiperWrapper[0].addEventListener('touchstart', function (e) {
          isDragging = true;
          startX = e.touches[0].clientX;
          startTranslateX = parseFloat(
            $swiperWrapper.css('transform').split(',')[4]
          ) || 0;
          $swiperWrapper.css('transition', 'none');
        }, { passive: true });

        $swiperWrapper[0].addEventListener('touchmove', function (e) {
          if (!isDragging) return;
          const deltaX = e.touches[0].clientX - startX;
          let newTranslateX = startTranslateX + deltaX;
          const minTranslate = -(maxIndex * slideWidth);
          newTranslateX = Math.max(Math.min(newTranslateX, 0), minTranslate);
          $swiperWrapper.css('transform', `translate3d(${newTranslateX}px, 0, 0)`);
        }, { passive: true });

        $swiperWrapper[0].addEventListener('touchend', function () {
          if (!isDragging) return;
          isDragging = false;
          $swiperWrapper.css('transition', 'transform 0.4s ease');
          const currentTranslate = Math.abs(
            parseFloat($swiperWrapper.css('transform').split(',')[4]) || 0
          );
          currentIndex = Math.min(Math.max(Math.round(currentTranslate / slideWidth), 0), maxIndex);
          updateSlidePosition();
        }, { passive: true });

        $swiperWrapper.on('mousedown', function (e) {
          isDragging = true;
          startX = e.clientX;
          startTranslateX = parseFloat(
            $swiperWrapper.css('transform').split(',')[4]
          ) || 0;
          $swiperWrapper.css('transition', 'none');
        });

        $(document).off('mousemove.finder').on('mousemove.finder', function (e) {
          if (!isDragging) return;
          const deltaX = e.clientX - startX;
          let newTranslateX = startTranslateX + deltaX;
          const minTranslate = -(maxIndex * slideWidth);
          newTranslateX = Math.max(Math.min(newTranslateX, 0), minTranslate);
          $swiperWrapper.css('transform', `translate3d(${newTranslateX}px, 0, 0)`);
        });

        $(document).off('mouseup.finder').on('mouseup.finder', function () {
          if (!isDragging) return;
          isDragging = false;
          $swiperWrapper.css('transition', 'transform 0.4s ease');
          const currentTranslate = Math.abs(
            parseFloat($swiperWrapper.css('transform').split(',')[4]) || 0
          );
          currentIndex = Math.min(Math.max(Math.round(currentTranslate / slideWidth), 0), maxIndex);
          updateSlidePosition();
        });
      });

      var openQuickviewPopup = async function (obj, e) {
        var $productCard = $(obj).closest('.js-pfv2-product-card');

        var productidx = $productCard.data("productidx");
        pfQuickviewProduct = state.productListData[productidx];

        if (utils.isNotNull(pfQuickviewProduct) === true) {
          await window.sg.components.Pd21ProductCard.buildQuickViewProductInfoArea(pfQuickviewProduct);
          window.sg.components.Pd21ProductFinder.showQuickView(obj);
        }

      }

      var $quickviewBtn = $('.pd21-product-card__quick-view');
      $quickviewBtn.off("click.finder");
      $quickviewBtn.on("click.finder", function (e) {
        openQuickviewPopup(this, e);
      });

      const $ratingBtn = $('.pd21-tooltip__container--rating button');
      $ratingBtn.off("mouseenter.rating click.rating");
      
      const handleRating = function (e) {
        const $optionInputEl = $(this);
        let modelCode = $optionInputEl.attr("data-modelCode");
        if ($optionInputEl.find(".pd21-tooltip__rating-list .pd21-tooltip__rating-item").length <= 0) {
          utils.reviewRatingLayer(modelCode, $optionInputEl);
        };
      };
      
      const supportsHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (supportsHover) {
        $ratingBtn.on("mouseenter.rating", handleRating);
      } else {
        $ratingBtn.on("click.rating", handleRating);
      }

      window.sg.components.Pd21ProductFinder.reInitCards();
    }

    if (window.sg.components.Pd21ProductCard) {
      window.sg.components.Pd21ProductCard = {
        ...window.sg.components.Pd21ProductCard,
        renderCards,
        appendCards,
        productCardEventListener,
        alignCardHeights,
      }
    } else {
      window.sg.components.Pd21ProductCard = {
        renderCards,
        appendCards,
        productCardEventListener,
        alignCardHeights,
      }
    }
  }

  $(function () {
    productFinderGrid();
  });

})();
(function ($) {
  'use strict';

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;
  const utils = pd21Modules.Utils;
  const apis = pd21Modules.ApiService;

	const pageTrack = $("#pfPageTrack").val();

  const Sort = (function ($) {
    const sort = {
      generateTemplate: function (data) {
        const sortOptions = data.sortOptions || [];

        if (sortOptions.length) {
          $(".pd21-sort__apply-cta-mob").removeClass("cta--disabled");
        } else {
          $(".pd21-sort__apply-cta-mob").addClass("cta--disabled");
        }

        const recommendSortIndex = sortOptions.findIndex(sortOption => sortOption.code === "recommended");
        if (recommendSortIndex !== -1) {
          state.selectedSortOption = sortOptions[recommendSortIndex];
        } else {
          state.selectedSortOption = sortOptions[0];
        }

        let sortOptionsTemplate = "";
        sortOptions.forEach(item => {
          sortOptionsTemplate += `<div class="radio-v3 pd21-sort__select-option">
        <input 
          class="radio-v3__input" 
          type="radio" name="radio" 
          id="${item.code}" ${item.code === state.selectedSortOption.code ? 'checked' : ''}
          an-tr="pd21_product finder / filter-${pageTrack}-sort-filter_and_sort"
          an-ca="filter and sort"
          an-ac="sort"
          an-la="sort:${item.name}"
        >
        <label class="radio-v3__label pd21-sort__select-option-label" for="${item.code}" data-sort-name="${item.name}" data-sort-code="${item.code}">
          <span class="radio-v3__label-box-wrap">
            <span class="radio-v3__label-box">
              <span class="radio-v3__label-box-circle"></span>
            </span>
          </span>
          <span class="radio-v3__label-text">${utils.truncateText(item.name, state.isMobile ? 53 : 41)}</span>
          <svg class="pd21-sort__select-option-icon" focusable="false">
            <use xlink:href="#done-bold" href="#done-bold"></use>
          </svg>
        </label>
      </div>`
        });

        return sortOptionsTemplate;
      },
      attachEventListeners: function () {
        const $sortContainer = $(".pd21-sort__list .scrollbar__contents");
        if (!$sortContainer.length || $sortContainer.data('hasSortListener')) return;

        $sortContainer.data('hasSortListener', true);

        $sortContainer.on('click', async function (e) {
          const $sortOptionLabel = $(e.target).closest('.pd21-sort__select-option-label[data-sort-code]');

          if ($sortOptionLabel.length) {
            state.selectedSortOption = {
              name: $sortOptionLabel.attr('data-sort-name'),
              code: $sortOptionLabel.attr('data-sort-code')
            }

            if (state.isMobile) return;

            try {
              state.startIndex = 0;
              state.requestCount = state.initialRequestCount;
              state.renderedMarketingCardsCount = 0;
              state.pfData = await apis.fetchData(state.filtersPayload, state.selectedSortOption.code);
              state.searchTotalCount = state.pfData.searchTotalCount;
              window.sg.components.Pd21ProductCard.renderCards(state.pfData);
            } catch (error) {
              console.error(error);
            }
          };
        });

        const $sortApplyBtn = $(".pd21-sort__contents-bottom .cta");
        if ($sortApplyBtn.length && !$sortApplyBtn.data('hasHandler')) {
          $sortApplyBtn.data('hasHandler', true);
          $sortApplyBtn.on('click', async function() {
            if (state.isMobile) {
              try {
                state.startIndex = 0;
                state.requestCount = state.initialRequestCount;
                state.renderedMarketingCardsCount = 0;
                state.pfData = await apis.fetchData(state.filtersPayload, state.selectedSortOption.code);
                state.searchTotalCount = state.pfData.searchTotalCount;
                window.sg.components.Pd21ProductCard.renderCards(state.pfData);
              } catch (error) {
                console.error(error);
              }
            }
          });
        }
      }
    }

    function renderSort(data) {
      const $sortContainer = $(".pd21-sort__list .scrollbar__contents");
      if ($sortContainer.length) {
        const sortOptionsTemplate = sort.generateTemplate(data);
        $sortContainer.html(sortOptionsTemplate);

        sort.attachEventListeners();
      }
    }

    return {
      renderSort: renderSort,
    };
  })($);

  // Attach to pd21Modules
  pd21Modules.Sort = Sort;

})(window.jQuery);
(function ($) {
  "use strict";

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;
  const apis = pd21Modules.ApiService;
  const utils = pd21Modules.Utils;
  const categoryUtils = pd21Modules.CategoryUtils;
  const { eddFilters, validateInput, fetchAndUpdateEDD } = pd21Modules.EddFilters;
  const isEpp =  $('#eppFlag').val();

  
	const pageTrack = $("#pfPageTrack").val();

  const checkIsPredefinedFilter = (filterName, optionName) => state.predefinedFilters.some(filter =>
    filter.filterName?.toLowerCase() === filterName?.toLowerCase() &&
    filter.filterOptionName?.toLowerCase() === optionName?.toLowerCase()
  );

  const checkIsDynamicFilter = (filterName, optionName) => state.dynamicFilters.some(filter =>
    filter.filterName?.toLowerCase() === filterName?.toLowerCase() &&
    filter.filterOptionName?.toLowerCase() === optionName?.toLowerCase()
  );

  const filterOptionsViewMoreText = utils.truncateText("View more", 30);
  const filterOptionsViewLessText = utils.truncateText("View less", 30);

  async function removeFilterHandler(filterName, filterOptionName) {
    state.appliedFiltersInSequence = state.appliedFiltersInSequence.filter(filter =>
      !(
        filter.filterName?.toLowerCase() === filterName?.toLowerCase() &&
        filter.filterOptionName?.toLowerCase() === filterOptionName?.toLowerCase()
      )
    );
    
    if (state.isMobile) {
      state.lastOpenedDropdown = "";
      state.isEddDropdownOpen = false;
      state.tempSelectedMobFilters = updateFilterValue(state.tempSelectedMobFilters, filterName, filterOptionName, 'REMOVE');
      // Immediately update applied filters on UI
      selectedFilterList.render();
      const appliedFiltersCount = state.appliedFiltersInSequence.length;
      $('.pd21-filter__mo-header-title-count').html(appliedFiltersCount > 0 ? `(${utils.countGreaterThan(appliedFiltersCount, 2)})` : '');
      window.sg.components.Pd21ProductFinder.reInitFilter();
      return;
    }

    state.filtersPayload = updateFilterValue(state.filtersPayload, filterName, filterOptionName, 'REMOVE');
    
    state.preventAutoScroll = true;
    
    // Immediately update applied filters on UI, then make API call for applied filters
    selectedFilterList.render();

    try {
      state.startIndex = 0;
      state.requestCount = state.initialRequestCount;
      state.renderedMarketingCardsCount = 0;
      state.pfData = await apis.fetchData(state.filtersPayload, state.selectedSortOption.code, { startIndex: state.startIndex, requestCount: state.requestCount });
      state.searchTotalCount = state.pfData.searchTotalCount;
      renderFilters(state.pfData); // Render filters including applied filters
      renderProductCards(state.pfData);
    } catch (error) {
      console.error(error);
    } finally {
      state.preventAutoScroll = false;
    }
  }

  async function filterOptionToggleHandler(filterSelect, e) {
    const $filterSelect = $(filterSelect);
    const $filterOption = $filterSelect.find('.pd21-filter__select-option[data-filter][data-filter-option]');
    const $filterOptionCheckbox = $filterSelect.find('.checkbox-v3__input[name="filter-option-checkbox"]');
    const $filterSelectorItem = $(e.target).closest(".pd21-filter__selector-item");

    if (!$filterOption.length || !$filterOptionCheckbox.length || !$filterSelectorItem.length) return;

    const filterName = $filterOption.attr('data-filter');
    const filterOptionName = $filterOption.attr('data-filter-option');

    if ($filterSelectorItem.hasClass("pd21-filter__selector-item--get-it-fast")) { // If select option from EDD filter
      state.isEddDropdownOpen = true;
      state.lastOpenedDropdown = "";
    } else if ($filterSelectorItem.hasClass("pd21-filter__selector-item--checkbox")) { // If select toggle filter
      state.isEddDropdownOpen = false;
      state.lastOpenedDropdown = "";
    } else {
      state.isEddDropdownOpen = false;
      state.lastOpenedDropdown = filterName;
    }

    if ($filterOptionCheckbox.prop('checked')) {
      if (state.isMobile) {
        state.isEddDropdownOpen = false; // Since the filters drawer will be closed after applying filters in mobile
        state.lastOpenedDropdown = ""; // Since the filters drawer will be closed after applying filters in mobile
        state.tempSelectedMobFilters = updateFilterValue(state.tempSelectedMobFilters, filterName, filterOptionName);

        // Immediately update applied filters on UI
        selectedFilterList.render();
        const appliedFiltersCount = state.appliedFiltersInSequence.length;
        $('.pd21-filter__mo-header-title-count').html(appliedFiltersCount > 0 ? `(${utils.countGreaterThan(appliedFiltersCount, 2)})` : '');
        window.sg.components.Pd21ProductFinder.reInitFilter();
        return;
      }

      state.filtersPayload = updateFilterValue(state.filtersPayload, filterName, filterOptionName);

      state.preventAutoScroll = true;

      // Immediately update applied filters on UI, then make API call for applied filters
      selectedFilterList.render();

      const appliedFiltersCount = state.appliedFiltersInSequence.length;
      $('.pd21-top__title-count').html(appliedFiltersCount > 0 ? `(${utils.countGreaterThan(appliedFiltersCount, 2)})` : '');

      try {
        state.startIndex = 0;
        state.requestCount = state.initialRequestCount;
        state.renderedMarketingCardsCount = 0;
        state.pfData = await apis.fetchData(state.filtersPayload, state.selectedSortOption.code, { startIndex: state.startIndex, requestCount: state.requestCount });
        state.searchTotalCount = state.pfData.searchTotalCount;
        renderFilters(state.pfData); // Render filters including applied filters
        renderProductCards(state.pfData)
      } catch (error) {
        console.error(error);
      } finally {
        state.preventAutoScroll = false;
      }
    } else {
      removeFilterHandler(filterName, filterOptionName);
    }
  }

  function updateQueryParams(
    filters,
    filterName,
    optionName,
    action = 'TOGGLE' // 'ADD' | 'REMOVE' | 'TOGGLE'
  ) {
    const filterIndex = filters.findIndex(
      f => f.name.toLowerCase() === filterName.toLowerCase()
    );

    // Filter exists
    if (filterIndex !== -1) {
      const filter = filters[filterIndex];
      const valueIndex = filter.values.indexOf(optionName);

      const shouldAdd = action === 'ADD' || (action === 'TOGGLE' && valueIndex === -1);
      const shouldRemove = action === 'REMOVE' || (action === 'TOGGLE' && valueIndex !== -1);

      if (shouldAdd) {
        filter.values.push(optionName);
      } else if (shouldRemove) {
        filter.values.splice(valueIndex, 1);

        if (filter.values.length === 0) {
          filters.splice(filterIndex, 1);
        }
      }
    } else if (action !== 'REMOVE') { // Filter does not exist → only ADD / TOGGLE
      filters.push({
        name: filterName,
        values: [optionName],
        value_norm: [optionName]
      });
    }

    state.queryParamFilters = filters;
  }

  function updateFilterValue(
    filters,
    filterName,
    optionName,
    action = 'TOGGLE' // 'ADD' | 'REMOVE' | 'TOGGLE'
  ) {
    updateQueryParams(state.queryParamFilters, filterName, optionName, action);

    const filterIndex = filters.findIndex(
      f => f.name.toLowerCase() === filterName.toLowerCase()
    );

    const isPredefined = checkIsPredefinedFilter(filterName, optionName);
    const isDynamic = checkIsDynamicFilter(filterName, optionName);

    const addToApplied = () => {
      state.appliedFiltersInSequence.push({
        filterName,
        filterOptionName: optionName,
        ...(isPredefined && { isPredefinedFilter: true }),
        ...(isDynamic && { isDynamicFilter: true })
      });
    };

    // Filter exists
    if (filterIndex !== -1) {
      const filter = filters[filterIndex];
      const valueIndex = filter.values.indexOf(optionName);

      const shouldAdd = action === 'ADD' || (action === 'TOGGLE' && valueIndex === -1);
      const shouldRemove = action === 'REMOVE' || (action === 'TOGGLE' && valueIndex !== -1);

      if (shouldAdd) {
        filter.values.push(optionName);
        filter.value_norm?.push(optionName);
        addToApplied();
      } else if (shouldRemove) {
        filter.values.splice(valueIndex, 1);
        filter.value_norm?.splice(valueIndex, 1);

        state.appliedFiltersInSequence = state.appliedFiltersInSequence.filter(
          f =>
            !(
              f.filterName?.toLowerCase() === filterName?.toLowerCase() &&
              f.filterOptionName?.toLowerCase() === optionName?.toLowerCase()
            )
        );

        if (filter.values.length === 0) {
          filters.splice(filterIndex, 1);
        }
      }
    } else if (action !== 'REMOVE') { // Filter does not exist then only execute for ADD / TOGGLE
      filters.push({
        name: filterName,
        values: [optionName],
        value_norm: [optionName]
      });

      addToApplied();
    }

    return filters;
  }

  function updateUrlQueryParams() {
    function mergeUrls() {
      const queryParamFilters = state.queryParamFilters
        ?.map(filter => ({
          ...filter,
          values: filter.values.filter(value =>
            !checkIsPredefinedFilter(filter.name, value) &&
            !checkIsDynamicFilter(filter.name, value)
          )
        }))
        .filter(filter => filter.values.length > 0); // Remove filters that end up with no values

      // Build grouped object with encoded keys and values
      const grouped = queryParamFilters?.reduce((acc, filter) => {
        let filterName = filter.name;
        const encodedFilterName = encodeURIComponent(filterName)
          .replace(/%20/g, '_'); // Replace space with underscore

        if (!acc[encodedFilterName]) {
          acc[encodedFilterName] = [];
        }

        const values = filter.values
          .map(value => encodeURIComponent(value)
            .replace(/%20/g, '+')); // Replace space with +

        acc[encodedFilterName] = values;

        return acc;
      }, {});

      // Build query parameters
      const params = Object.entries(grouped)
        .filter(([_, values]) => values.length > 0)
        .map(([key, values]) => `${key}=${values.join(',')}`);

      // Check for wcmmode parameter in current URL
      const currentUrl = new URL(window.location.href);
      const hasWcmMode = currentUrl.searchParams.get('wcmmode') === 'disabled';

      if (params.length === 0) {
        return hasWcmMode ? '?wcmmode=disabled' : '';
      }

      const queryString = params.join('&');
      return hasWcmMode ? `?wcmmode=disabled&${queryString}` : `?${queryString}`;
    }

    let url = window.location.href;
    let [baseUrl, _] = url.split('?');

    const updatedBrowserUrl = baseUrl + mergeUrls(state.queryParamFilters);
    window.history.replaceState({}, '', updatedBrowserUrl);
  }

  // Filters Types:
  // 1. Dropdown filter
  // 2. 'Get it Fast' filter (EDD)
  // 3. On/Off toggle filter (eg. 'Energy Efficient' filter)

  // 1. Dropdown filters
  const dropdownFilters = {
    generateTemplate: function (filter) {
      let template = "";
      let filterOptions = filter?.filterValues || [];

      filterOptions = filterOptions.filter(option => option.name.indexOf('3-Day Delivery') === -1);
      filterOptions = filterOptions.filter(option => option.name.indexOf('next-day delivery') === -1);
      filterOptions = filterOptions.filter(option => option.on_flag !== true && option.on_flag !== 'Y');

      if (categoryUtils.isMonitorPage() || categoryUtils.isHEPage() || categoryUtils.isMemoryStoragePage()) {
        const filtersNotToInclude = ['store pickup eligible', 'in-store pickup'];
        filterOptions = filterOptions.filter(option => {
          const filterOptionName = option.name.toLowerCase();
          return !filtersNotToInclude.includes(filterOptionName)
        })
      }

      const isAllOptionsAreDisabled = filterOptions?.every(option => option.enabledFilter === false);
      if (isAllOptionsAreDisabled) return ''; // Skip rendering the filter

      template += `<div class="pd21-filter__selector-item pd21-filter__selector-item--menu ${filter.name === state.lastOpenedDropdown ? "pd21-filter__selector-item--show pd21-filter__selector-item--open" : ""}">
        <!-- Dropdown trigger -->
        <button 
          class="pd21-filter__selector-item-cta"
          an-tr="pd21_product finder / filter-${pageTrack}-filter category-filter_and_sort"
          an-ca="filter and sort"
          an-ac="filter"
          an-la="filter:${filter.filterDisplayName}"
        >
          <span>${utils.truncateText(filter.filterDisplayName, 33)}</span>
          <svg class="icon">
            <use xlink:href="#open-down-regular" href="#open-down-regular"></use>
          </svg>
        </button>

        <!-- Dropdown options -->
        <div class="pd21-filter__option scrollbar" style="max-height: none;">
          <div class="scrollbar__wrap">
            <div class="pd21-filter__option-list scrollbar__contents">
              ${dropdownFilters.generateOptionsTemplate(filter, filterOptions)}
              <button class="cta cta--underline-v2 cta--black cta--icon pd21-filter__selector-view-more"
                data-text-more="${filterOptionsViewMoreText}" data-text-less="${filterOptionsViewLessText}">
                <span>${filterOptionsViewMoreText}</span>
                <svg class="icon" focusable="false" aria-hidden="true">
                  <use xlink:href="#open-down-bold" href="#open-down-bold"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="scrollbar-horizontal__track" style="display: none;">
            <div class="scrollbar-horizontal__track-content">
              <div class="scrollbar-horizontal__bar"></div>
            </div>
          </div>
          <div class="scrollbar-vertical__track" style="display: none;">
            <div class="scrollbar-vertical__track-content">
              <div class="scrollbar-vertical__bar"></div>
            </div>
          </div>
        </div>
      </div>
      `
    return template;
    },
    generateOptionsTemplate: function(filter, filteredOptions) {
    let template = "";
    let filterOptions = filteredOptions;

    let optionTextMaxChars = state.isMobile ? 49 : 80;
    
    for (let i = 0; i < filterOptions?.length; i++) {
        const option = filterOptions[i];
        const filterName = filter.name;
        const checkboxId = utils.generateCheckboxId(filterName, option.name, i);

        template += `
        <!-- Dropdown option -->
        <div class="checkbox-v3 pd21-filter__select" 
          style="pointer-events: ${checkIsPredefinedFilter(filterName, option.name) || checkIsDynamicFilter(filterName, option.name) ? 'none' : 'auto'};">
          <input 
            class="checkbox-v3__input" 
            type="checkbox" 
            name="filter-option-checkbox"
            id="${checkboxId}" 
            ${option.checked ? 'checked' : '' }
            ${option.enabledFilter ? '' : 'disabled'} 
            an-tr="pd21_product finder / filter-${pageTrack}-filter list-filter_and_sort"
            an-ca="filter and sort"
            an-ac="filter"
            an-la="filter:${filter.filterDisplayName}:${utils.escapeHtml(option.name)}"
          >
          <label class="checkbox-v3__label pd21-filter__select-option" data-filter="${utils.escapeHtml(filterName)}"
            data-filter-option="${utils.escapeHtml(option.name)}"
            for="${checkboxId}">
            <span class="checkbox-v3__label-box-wrap">
              <span class="checkbox-v3__label-box">
                <svg class="checkbox-v3__label-box-icon" focusable="false" aria-hidden="true">
                  <use xlink:href="#done-bold" href="#done-bold"></use>
                </svg>
              </span>
            </span>
            <span class="checkbox-v3__label-text">${utils.truncateText(option.name, optionTextMaxChars)}</span>
          </label>
        </div>
        `
    }

    return template;
    }
  };

  // 3. Toggle filter
  const toggleFilters = {
    generateTemplate: function (filter) {
      const toggleTypeFilters = filter?.filterValues
        ?.filter(option => (option.on_flag === true || option.on_flag === "Y") && option.enabledFilter === true)
        .map(option => ({
          ...option,
          filterDisplayName: filter.filterDisplayName,
          name: filter.name,
          optionName: option.name,
        }));

      if (toggleTypeFilters.length === 0) return "";

      let template = "";
      
      for (let i = 0; i < toggleTypeFilters.length; i++) {
        const filter = toggleTypeFilters[i];
        const checkboxId = utils.generateCheckboxId(filter.name, filter.optionName, i);
        
        template += `<div class="pd21-filter__selector-item pd21-filter__selector-item--checkbox">
          <div class="checkbox-v3 pd21-filter__select">
            <input 
              class="checkbox-v3__input" 
              type="checkbox" 
              name="filter-option-checkbox" id="${checkboxId}" 
            ${filter.checked? 'checked' : '' }
            ${filter.enabledFilter ? '' : 'disabled' }
            an-tr="pd21_product finder / filter-${pageTrack}-filter list-filter_and_sort"
            an-ca="filter and sort"
            an-ac="filter"
            an-la="filter:${filter.optionName}"
          >
            <label class="checkbox-v3__label pd21-filter__select-option" for="${checkboxId}" data-filter="${utils.escapeHtml(filter.name)}"
              data-filter-option="${utils.escapeHtml(filter.optionName)}">
              <span class="checkbox-v3__label-box-wrap">
                <span class="checkbox-v3__label-box">
                  <svg class="checkbox-v3__label-box-icon" focusable="false" aria-hidden="true">
                    <use xlink:href="#done-bold" href="#done-bold"></use>
                  </svg>
                </span>
              </span>
              <span class="checkbox-v3__label-text">${utils.truncateText(filter.optionName, state.isMobile ? 32 : 33)}</span>
            </label>
          </div>
        </div>
        `
      }

      return template;
    }
  }

  // Applied filter list
  const selectedFilterList = {
    render: function () {
      if (!state.isMobile) {
        updateUrlQueryParams();
      }

      const filterSelectedListTemplate = this.generateTemplate();
      $('.pd21-filter__selected-list').html(filterSelectedListTemplate);
    },
    generateTemplate: function () {
      const filterSelectedViewMoreText = utils.truncateText("View more", 30);
      const filterSelectedViewLessText = utils.truncateText("View less", 30);

      let template = '';

      state.appliedFiltersInSequence?.forEach(item => {
        let optionNameShortText = utils.truncateText(item.filterOptionName, state.isMobile ? 24 : 50);

        template += `
        <div 
          class="pd21-filter__selected-item"  
          data-filter="${utils.escapeHtml(item.filterName)}"
        data-filter-option="${utils.escapeHtml(item.filterOptionName)}"
      >
          <span>${optionNameShortText}</span>
          <svg 
          style="pointer-events: ${checkIsPredefinedFilter(item.filterName, item.filterOptionName) || checkIsDynamicFilter(item.filterName, item.filterOptionName) ? 'none' : 'auto'};" 
          class="icon pd21-filter__remove-btn" 
          focusable="false" 
          aria-hidden="true" 
          an-tr="pd21_product finder / filter-${pageTrack}-selected option chip-filter_and_sort"
          an-ca="filter and sort"
          an-ac="filter"
          an-la="selected option chip:${item.filterOptionName}:delete" 
          >
            <use xlink:href="#cancel-close-regular" href="#cancel-close-regular"></use>
          </svg>
        </div>
        `
      });

      template += `
      <button class="cta cta--underline-v2 cta--black cta--icon pd21-filter__selected-view-more"
        data-text-more="${filterSelectedViewMoreText}" data-text-less="${filterSelectedViewLessText}">
        <span>${filterSelectedViewMoreText}</span>
        <svg class="icon" focusable="false" aria-hidden="true">
          <use xlink:href="#open-down-bold" href="#open-down-bold"></use>
        </svg>
      </button>
      `;

      return template;
    },
    clearAll: async function () {
      const keepFilters = [];

      state.filtersPayload.forEach(filter => {
        const keepValues = filter.values.filter(value => {
          return checkIsPredefinedFilter(filter.name, value) || checkIsDynamicFilter(filter.name, value);
        });

        if (keepValues.length > 0) {
          keepFilters.push({
            name: filter.name,
            values: [...keepValues],
            value_norm: [...keepValues]
          });
        }
      });

      const keepAppliedFilters = state.appliedFiltersInSequence.filter(filter => {
        return checkIsPredefinedFilter(filter.filterName, filter.filterOptionName) || checkIsDynamicFilter(filter.filterName, filter.filterOptionName);
      });

      state.filtersPayload = [...keepFilters];
      state.appliedFiltersInSequence = [...keepAppliedFilters];

      state.tempSelectedMobFilters = [...keepFilters];

      state.queryParamFilters = [];

      state.lastOpenedDropdown = "";
      state.isEddDropdownOpen = false;

      state.startIndex = 0;
      state.requestCount = state.initialRequestCount;
      state.renderedMarketingCardsCount = 0;

      state.preventAutoScroll = true;

      try {
        state.pfData = await apis.fetchData(state.filtersPayload, state.selectedSortOption.code);
        state.searchTotalCount = state.pfData.searchTotalCount;
        updateUrlQueryParams();
        renderFilters(state.pfData); // Render filters including applied filters
        window.sg.components.Pd21Modules.Utils.visibleScroll(); // To allow background scrolling to navigate to the first product
        renderProductCards(state.pfData);
      } catch (error) {
        console.error(error);
      } finally {
        state.preventAutoScroll = false;
      }
    }
  };

  // Filters
  const filters = {
    generateTemplate: function (data) {
      let filterList = '';

      state.filtersByType?.forEach((filter) => {
        if (filter.renderType === 'toggle') {
          filterList += toggleFilters.generateTemplate(filter);
        } else {
          filterList += dropdownFilters.generateTemplate(filter);
        }
      });

    return `
    <div class="pd21-filter__mo-header">
      <p class="pd21-filter__mo-header-title">${utils.truncateText("Filters", 23)} <span class="pd21-filter__mo-header-title-count"></span></p>
      <p class="pd21-filter__mo-header-result">
        <span class="pd21-filter__mo-header-result-count"></span> <span class="pd21-filter__mo-header-result-text">${utils.truncateText("Results", 24)}</span>
      </p>
      <button 
        class="pd21-filter__close"
        data-js-action="pd21MoFilterClose"
        an-tr="pd21_product finder / filter-${pageTrack}-filter action-filter_and_sort"
        an-ca="filter and sort"
        an-ac="filter"
        an-la="filter:close"
      >
        <span class="hidden">close</span>
        <svg class="icon">
          <use xlink:href="#cancel-close-regular" href="#cancel-close-regular"></use>
        </svg>
      </button>
    </div>

    <div class="pd21-filter__filter">
      <div class="pd21-filter__filter-inner">
        <div class="pd21-filter__selector-list">
          <!-- Get it fast filter - Only applicable for DA and VD -->
          ${state.showEddFilter ? eddFilters(data) : ""}
          <!-- Dropdown/toggle filters -->
          ${filterList}
          
          <!-- Clear all CTA for PC -->
          <button 
            class="cta cta--underline-v2 cta--black pd21-filter__clear--pc"
            an-tr="pd21_product finder / filter-${pageTrack}-filter action-filter_and_sort"
            an-ca="filter and sort"
            an-ac="filter"
            an-la="filter:clear all"
          >
            ${utils.truncateText("Clear all", 20)}
          </button>
        </div>
        <div class="pd21-filter__selected-list"></div>
      </div>
    </div>
    <div class="pd21-filter__mo-cta">
      <button
        class="cta cta--underline-v2 cta--black pd21-filter__clear--mo"
        an-tr="pd21_product finder / filter-${pageTrack}-filter action-filter_and_sort"
        an-ca="filter and sort"
        an-ac="filter"
        an-la="filter:clear all"
      >
        ${utils.truncateText("Clear all", 27)}
      </button>
      <button 
        class="cta cta--contained cta--black cta--black pd21-filter__apply--mo"
        an-tr="pd21_product finder / filter-${pageTrack}-filter action-filter_and_sort"
        an-ca="filter and sort"
        an-ac="filter"
        an-la="filter:apply filters"
      >
        ${utils.truncateText("Apply filters", 21)}
      </button>
    </div>
    `;
    },
    attachEventListeners: function () {
      const $filterRoot = $(".pd21-filter");
      if (!$filterRoot.length) return;

      if (!$filterRoot.data('hasFilterListener')) {
        $filterRoot.data('hasFilterListener', true);

        $filterRoot.on('click', this.handleFilterClickEvent); // Click Event Delegation
        $filterRoot.on('input', this.handleFilterInputEvent); // Input Event Delegation (e.g., text input changes)
        $filterRoot.on('change', this.handleFilterChangeEvent); // Change Event Delegation (e.g., checkbox check/uncheck)
      }

      // Mobile filter opener - outside filterRoot, needs separate listener
      const $mobileOpener = $(".pd21-top__mo-filter-opener");
      if ($mobileOpener.length && !$mobileOpener.data('hasHandler')) {
        $mobileOpener.data('hasHandler', true);
        $mobileOpener.on('click', function () {
          state.tempSelectedMobFilters = utils.deepClone(state.filtersPayload);
          window.sg.components.Pd21ProductFinder.showMobileFilter();
        });
      }
    },
    handleFilterClickEvent: async function (e) {
      // Handle remove filter (When click on cross icon)
      const $filterRemoveBtn = $(e.target).closest('.pd21-filter__remove-btn');
      if ($filterRemoveBtn.length) {
        const $item = $filterRemoveBtn.closest('.pd21-filter__selected-item');
        if (!$item.length) return;

        const filterName = $item.attr('data-filter');
        const filterOptionName = $item.attr('data-filter-option');

        const $filterOption = $(`.pd21-filter__select-option[data-filter="${CSS.escape(filterName)}"][data-filter-option="${CSS.escape(filterOptionName)}"]`);
        const $filterOptionSelect = $filterOption.closest(".pd21-filter__select");
        const $filterOptionCheckbox = $filterOptionSelect.find('.checkbox-v3__input[name="filter-option-checkbox"]');

        if ($filterOptionCheckbox.length) {
          state.lastOpenedDropdown = "";
          state.isEddDropdownOpen = false;
          $filterOptionCheckbox.prop('checked', false);
          removeFilterHandler(filterName, filterOptionName);
        }
        return;
      }

      // Handle Clear All button
      const $clearBtn = $(e.target).closest('.pd21-filter__clear--pc, .pd21-filter__clear--mo');
      if ($clearBtn.length) {
        await selectedFilterList.clearAll();
        return;
      }

      // Handle Mobile Apply CTA
      const $mobileFilterApplyCTA = $(e.target).closest(".pd21-filter__apply--mo");
      if ($mobileFilterApplyCTA.length) {
        if (state.isMobile) {
          state.filtersPayload = utils.deepClone(state.tempSelectedMobFilters);
          updateUrlQueryParams();

          const $filtersCountMobCTA = $('.pd21-top__count');
          if ($filtersCountMobCTA.length) {
            const appliedFiltersCount = state.appliedFiltersInSequence.length;
            $filtersCountMobCTA.html(appliedFiltersCount > 0 ? `(${utils.countGreaterThan(appliedFiltersCount, 2)})` : '');
          }
        }

        try {
          state.startIndex = 0;
          state.requestCount = state.initialRequestCount;
          state.renderedMarketingCardsCount = 0;
          state.pfData = await apis.fetchData(state.filtersPayload, state.selectedSortOption.code);
          state.searchTotalCount = state.pfData.searchTotalCount;
          renderFilters(state.pfData); // Render filters including applied filters
          renderProductCards(state.pfData);
        } catch (error) {
          console.error(error);
        }
        return;
      }

      // Mobile filter close
      const $mobileFilterClose = $(e.target).closest(".pd21-filter__close");
      if ($mobileFilterClose.length) {
        state.tempSelectedMobFilters = utils.deepClone(state.filtersPayload);
        state.appliedFiltersInSequence = [];
        state.filtersPayload?.forEach(filter => {
          filter.values?.forEach(value => {
            state.appliedFiltersInSequence.push({
              filterName: filter.name,
              filterOptionName: value
            });
          });
        });

        window.sg.components.Pd21ProductFinder.hideMobileFilter();
        setTimeout(() => {
          renderFilters(state.pfData); // Reset to previous selected filters including applied filters
        }, 500);
        
        return;
      }
    },
    handleFilterInputEvent: function (e) {
      // Zipcode Input
      const $zipcodeInput = $(e.target).closest('.text-field-v2__zipcode');
      if ($zipcodeInput.length) {
        validateInput(e);
        return;
      }
    },
    handleFilterChangeEvent: async function (e) {
      // Handle filter option select
      const $filterSelect = $(e.target).closest(".pd21-filter__select");
      if ($filterSelect.length) {
        await filterOptionToggleHandler($filterSelect[0], e);
        return;
      }
    },
    render: function (data) {
      const filtersTemplate = filters.generateTemplate(data);
      const $filtersRootContainer = $(".pd21-filter");
      $filtersRootContainer.html(filtersTemplate);

      window.sg.components.Pd21ProductFinder.reInitFilter();

      // Attach event listeners
      this.attachEventListeners(data);
    },
  };

  function updateFiltersAndResultsCount(data) {
    /*** PC ***/
    const $filtersCountEl = $('.pd21-top__title-count');
    const $resultsCountEl = $('.pd21-top__result-count');

    if ($filtersCountEl.length) { // Filters count
      let appliedFiltersCount = state.appliedFiltersInSequence.length;
      $filtersCountEl.html(`${appliedFiltersCount > 0 ? `(${utils.countGreaterThan(appliedFiltersCount, 2)})` : ''}`);
    }
    if ($resultsCountEl.length) { // Results count
      let searchTotalCount = data.searchTotalCount;
      searchTotalCount = utils.countGreaterThan(searchTotalCount, 3);
      $resultsCountEl.html(`${searchTotalCount}`);
    }

    /*** Mobile ***/
    const $filtersCountMobEl = $('.pd21-filter__mo-header-title-count');
    const $resultsCountMobEl = $('.pd21-filter__mo-header-result-count');

    if ($filtersCountMobEl.length) { // Filters count
      const appliedFiltersCount = state.appliedFiltersInSequence.length;
      $filtersCountMobEl.html(appliedFiltersCount > 0 ? `(${utils.countGreaterThan(appliedFiltersCount, 2)})` : '');
    }
    if ($resultsCountMobEl.length) { // Results count
      let searchTotalCount = data.searchTotalCount;
      searchTotalCount = utils.countGreaterThan(searchTotalCount, 3);
      $resultsCountMobEl.html(`${searchTotalCount}`);
    }

    /*** Mobile (Drawer header) ***/
    const $filtersCountMobCTA = $('.pd21-top__count');
    if ($filtersCountMobCTA.length) {
      const appliedFiltersCount = state.appliedFiltersInSequence.length;
      $filtersCountMobCTA.html(appliedFiltersCount > 0 ? `(${utils.countGreaterThan(appliedFiltersCount, 2)})` : '');
    }
  }

  function handleNoResults(data) {
    const $noResultEl = $(".pd21-product-finder__no-result");
    if ($noResultEl.length) {
      $noResultEl.css('display', (!data.searchResults || data.searchResults?.length < 1) ? "block" : "none");
    }
  }

  function renderFilters(data) {
    state.filtersByType = data?.filters?.map(filter => {
      const { filterValues } = filter;

      const isAllToggleFiltersEnabled = (filterValues) => {
        const isAllItemsWithFlag = filterValues?.every((item) =>
          Object(item).hasOwnProperty("on_flag")
        );

        if (!isAllItemsWithFlag) {
          return false;
        } else {
          const isAllFlagsChecked = filterValues.every((item) => item.on_flag === true || item.on_flag === "Y");
          return isAllFlagsChecked;
        }
      };

      const areAllOptionsToggleType = isAllToggleFiltersEnabled(filterValues);

      return {
        ...filter,
        renderType: areAllOptionsToggleType ? "toggle" : "dropdown"
      };
    }) || [];

    filters.render(data);
    updateFiltersAndResultsCount(data);
    selectedFilterList.render(data);
    window.sg.components.Pd21ProductFinder.reInit();
  }

  async function renderProductCards(data, isAppend = false) {
    handleNoResults(data);

    if (isAppend) {
      window.sg.components.Pd21ProductCard.appendCards(data);
    } else {
      window.sg.components.Pd21ProductCard.renderCards(data);
    }
  }

  const $viewMoreBtn = $(".pd21-product-finder__view-more");
  let isLoading = false; // prevents duplicate calls

  const productCardList = $(".pd21-product-card__list");
  if (productCardList?.find(".pd21-product-card__item").length === 0) {
    $viewMoreBtn.hide();
  }

  const loadMoreProducts = async () => {

    if (isLoading) return;

    state.startIndex += state.requestCount;

    const remainingMarketingCards = utils.getPromoCardsCount() - state.renderedMarketingCardsCount;
    const marketingCards = categoryUtils.isHAPage() ? Math.min(2, remainingMarketingCards) : remainingMarketingCards;
    state.requestCount = marketingCards > 0 ? state.itemsPerPage - marketingCards : state.itemsPerPage;

    if(state.startIndex >= state.searchTotalCount) {
      $viewMoreBtn.hide();
      return;
    }

    isLoading = true;
    setTimeout(async () => {
      
      try {
        state.pfData = await apis.fetchData(
          state.filtersPayload,
          state.selectedSortOption.code,
          { startIndex: state.startIndex, requestCount: state.requestCount }
        );

        state.searchTotalCount = state.pfData.searchTotalCount;
        if(state.pfData) {
          const isAppend = true;
          await renderProductCards(state.pfData, isAppend);
        }

      } catch (error) {

        console.error(error);
      } finally {

        $viewMoreBtn.html(`
            View more
            <svg class="icon" focusable="false" aria-hidden="true">
              <use xlink:href="#open-down-regular" href="#open-down-regular"></use>
            </svg>
          `);

        isLoading = false;
      }
    }, 500);
  }

  const handleScroll = async () => {
    
    if($viewMoreBtn.is(":hidden")) return;

    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    const btnOffsetTop = $viewMoreBtn.offset().top;

    if (scrollTop + windowHeight >= btnOffsetTop) {
      await loadMoreProducts();
    }
  };

  let debounceTimer;
  $(window).on('scroll', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleScroll, 200); 
  });

  pd21Modules.Filters = {
    renderFilters: renderFilters,
    handleNoResults: handleNoResults,
  };

})(window.jQuery);
(function ($) {
  "use strict";

  const pd21Modules = window.sg.components.Pd21Modules;
  const state = pd21Modules.State;
  const utils = pd21Modules.Utils;
  const apis = pd21Modules.ApiService;
  const categoryUtils = pd21Modules.CategoryUtils;
  const { renderFilters, handleNoResults } = pd21Modules.Filters;
  const { renderSort } = pd21Modules.Sort;
  
  state.sessionID = utils.generateRandomID(); // For a user journey throughout a single PF flow, the sessionID remains the same.
  
  const showEppEntryPointLink = $("#showEppEntryPointLink").val();
  const isEpp = $('#eppFlag').val() === 'Y';

  const $filtersText = $('.pd21-top__title-text');
  const $resultsText = $('.pd21-top__result-text');
  const $filterMobOpenerText = $('.pd21-top__mo-filter-opener-text');
  const $sortHeadText = $('.pd21-sort__opener-text');
  const $sortMobHeadText = $('.pd21-sort__contents-head-text');
  const $sortApplyCtaMobile = $('.pd21-sort__apply-cta-mob');

  $filtersText.text(utils.truncateText("Filters", 23));
  $resultsText.text(utils.truncateText("Results", 24));
  $filterMobOpenerText.text(utils.truncateText("Filters", 23));
  $sortHeadText.text(utils.truncateText("Sort", 12));
  $sortMobHeadText.text(utils.truncateText("Sort", 21));
  $sortApplyCtaMobile.text(utils.truncateText("Apply sort", 28));

  const initialFiltersPayload = [];

  const convertKeyToSupportingFormat = function (key) {
    let decodedStr = decodeURIComponent(key);
    let strWithoutUnderscore = decodedStr.replace(/_/g, ' ');
    return strWithoutUnderscore;
  }

  const initializeAuthoredFilters = (filterListName) => {
    if (!filterListName) return;

    const $filterInputs = $(`input[name="${filterListName}"]`);

    const isPredefinedFilter = filterListName === "predefinedFilterList";
    const isDynamicFilter = filterListName === "dynamicFilterList";

    $filterInputs.each(function () {
      const filterStr = $(this).val();
      if (!filterStr) return;

      const items = filterStr.split('&');
      items?.forEach(value => {
        const [key, filterValue] = value.split('%3D'); // Split by encoded '='

        if (!key || !filterValue) return;

        const filterName = convertKeyToSupportingFormat(key);

        const filterExists = initialFiltersPayload.some(filter => filter.name?.toLowerCase() === filterName?.toLowerCase()); // Ignore if already present in the URL
        if (filterExists) return;

        const decodedValue = decodeURIComponent(filterValue);

        let values = decodedValue.split(',');
        values = values.map(val => {
          const valWithoutPlus = val.replace(/\+/g, ' ');
          return decodeURIComponent(valWithoutPlus);
        }).filter(Boolean);

        const existingFilter = initialFiltersPayload.find(
          filter => filter.name.toLowerCase() === filterName.toLowerCase()
        );

        if (existingFilter) {
          existingFilter.values.push(...values);
          existingFilter.value_norm.push(...values);
        } else {
          initialFiltersPayload.push({
            name: filterName,
            values: [...values],
            value_norm: [...values]
          });
        }

        values.forEach(value => {
          if (isPredefinedFilter) {
            state.predefinedFilters.push({
              filterName: filterName,
              filterOptionName: value,
            })
          } else if (isDynamicFilter) {
            state.dynamicFilters.push({
              filterName: filterName,
              filterOptionName: value,
            })
          }
        });
      });
    });
  }

  function renderEPPLinkSection() {
    let text = "Check Eligibility for Exclusive Offers";
    text = utils.truncateText(text, 61);
    $('.pd21-top__epp-benefit-text').text(text);

    if (showEppEntryPointLink === "true" && !isEpp) {
      $('.pd21-top__epp-benefit').show();
    } else {
      $('.pd21-top__epp-benefit').hide();
    }
  }

  function renderProductCards(data) {
    handleNoResults(data);
    window.sg.components.Pd21ProductCard.renderCards(data);
  }

  function renderPF() {
    try {
      renderEPPLinkSection();
      renderFilters(state.pfData); // Render filters including applied filters
      renderSort(state.pfData);
      renderProductCards(state.pfData);
      window.sg.components.Pd21ProductFinder.reInit();
      state.isFirstRender = false;
    } catch (error) {
      console.error(error);
    }
  }

  async function init() {
    try {
      const url = new URL(window.location.href);
      if (url.search.length > 1) {
        const queryString = url.search.substring(1);

        // Get query parameters
        const params = queryString.split('&');

        params?.forEach(queryParam => {
          const [key, value] = queryParam?.split('=');
          if (!key || !value) return;
          // key: filter name - eg. offers
          // value: filter option names - URL-encoded and separated by commas - eg. Buy+More%2C+Save+More,Free+Water+Filter

          // Skip wcmmode
          if (key === 'wcmmode') return;

          const filterName = convertKeyToSupportingFormat(key);

          // Split by comma first (Before decoding)
          let values = value.split(','); // eg. ["Buy+More%2C+Save+More", "Free+Water+Filter"]
          values = values.map(val => {
            const valWithoutPlus = val.replace(/\+/g, ' '); // eg. ["Buy More%2CSave More", "Free Water Filter"]
            return decodeURIComponent(valWithoutPlus); // eg. // eg. ["Buy More, Save More", "Free Water Filter"]
          }).filter(Boolean);

          initialFiltersPayload.push({
            name: filterName,
            values: [...values],
            value_norm: [...values]
          });
        });
      }

      //predefined filters
      initializeAuthoredFilters("predefinedFilterList");
      //dynamic filters
      initializeAuthoredFilters("dynamicFilterList");

      state.filtersPayload = initialFiltersPayload;
      state.queryParamFilters = initialFiltersPayload;

      state.startIndex = 0;
      state.pfData = await apis.fetchData(state.filtersPayload, state.selectedSortOption.code, { startIndex: state.startIndex, requestCount: state.requestCount });
      state.searchTotalCount = state.pfData.searchTotalCount;

      state.pfData?.appliedFilters?.forEach(filter => {
        filter?.values?.forEach(value => {
          state.appliedFiltersInSequence.push({
            filterName: filter.name,
            filterOptionName: value,
          });
        });
      });

      const updatedAppliedFilters = state.appliedFiltersInSequence.filter(appliedFilter => {
        const filterGroup = state.pfData?.filters?.find(
          f => f.name?.toLowerCase() === appliedFilter.filterName?.toLowerCase()
        );

        const combinationExists = filterGroup?.filterValues?.some(
          fv => fv.name?.toLowerCase() === appliedFilter.filterOptionName?.toLowerCase()
        );

        return combinationExists; // Keep only if true
      });

      state.appliedFiltersInSequence = [...updatedAppliedFilters];

      // Reorder Applied filters to place Predefined or Dynamic filters at the beginning
      function reorderAppliedFilters(appliedFiltersInSequence, predefinedFilters, dynamicFilters) {
        const filtersToMoveFirst = [...predefinedFilters, ...dynamicFilters];

        const filtersMatch = (filter1, filter2) =>
          filter1.filterName.toLowerCase() === filter2.filterName.toLowerCase() &&
          filter1.filterOptionName.toLowerCase() === filter2.filterOptionName.toLowerCase();

        const beginning = appliedFiltersInSequence.filter(appliedFilter =>
          filtersToMoveFirst.some(filter => filtersMatch(appliedFilter, filter))
        );

        const rest = appliedFiltersInSequence.filter(appliedFilter =>
          !filtersToMoveFirst.some(filter => filtersMatch(appliedFilter, filter))
        );

        return [...beginning, ...rest];
      }

      const reorderedAppliedFilters = reorderAppliedFilters(state.appliedFiltersInSequence, state.predefinedFilters, state.dynamicFilters);
      state.appliedFiltersInSequence = [...reorderedAppliedFilters];

      state.filtersPayload = state.pfData?.appliedFilters; // To preserve original casing from API response

      renderPF();
    } catch (error) {
      console.error(error);
    }
  }

  $(function () {
    init();
  });
})(window.jQuery);