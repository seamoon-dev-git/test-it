document.getElementById("year").textContent = new Date().getFullYear();

      (function initMobileScrollTop() {
        const btn = document.getElementById("mobile-scroll-top");
        const hero = document.getElementById("hero");
        const mqMobile = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        if (!btn) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const pastHero = () => {
          if (!hero) return window.scrollY > window.innerHeight * 0.45;
          const top = hero.getBoundingClientRect().top + window.scrollY;
          const bottom = top + hero.offsetHeight;
          return window.scrollY >= bottom - 48;
        };

        const sync = () => {
          if (!mqMobile.matches) {
            btn.classList.remove("is-visible");
            btn.hidden = true;
            return;
          }
          const show = pastHero();
          btn.classList.toggle("is-visible", show);
          btn.hidden = !show;
        };

        btn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });

        window.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", sync);
        sync();
      })();



      /** href="#" 플레이스홀더: 포인터만 유지하고 이동·해시 스크롤 없음 */
      
      (function initAriaDisabledLinks() {
        document.querySelectorAll('a[aria-disabled="true"]').forEach((a) => {
          if (!a.hasAttribute("tabindex")) a.setAttribute("tabindex", "-1");
        });
      })();

      (function initEmptyPlaceholderLinks() {
        document.addEventListener(
          "click",
          (e) => {
            const a = e.target.closest && e.target.closest("a[data-empty-link]");
            if (!a) return;
            e.preventDefault();
          },
          true
        );
      })();

      /** 탑 GNB: 히어로 최상단에서는 투명 + 페이지 장식 BG 숨김 · 스크롤 시 화이트 바·장식 표시 */
      (function initHeaderSolidOnScroll() {
        const header = document.getElementById("site-header");
        const pageBg = document.getElementById("page-bg-decoration");
        if (!header) return;

        const THRESH = 16;

        const tick = () => {
          const y = window.scrollY || document.documentElement.scrollTop || 0;
          const solid = y > THRESH;
          header.classList.toggle("is-solid", solid);
          if (pageBg) pageBg.classList.toggle("is-dimmed-for-hero", !solid);
        };

        tick();
        window.addEventListener("scroll", tick, { passive: true });
        window.addEventListener("resize", tick);
      })();

      /** 탑 GNB: 검색 아이콘 → 풀오버 검색 */
      (function initHeaderSearchOverlay() {
        const button = document.getElementById("header-search-button");
        const overlay = document.getElementById("header-search-overlay");
        const header = document.getElementById("site-header");
        const input = document.getElementById("header-search-input");
        const form = overlay?.querySelector(".header-search__form");
        const searchIcon = button?.querySelector(".header-toolbar-icon");
        const mobileMenuBtn = document.getElementById("mobile-menu-button");
        if (!button || !overlay || !header) return;

        const panel = overlay.querySelector(".header-search-overlay__panel");

        const closeMobileMenuIfOpen = () => {
          if (mobileMenuBtn && mobileMenuBtn.getAttribute("aria-expanded") === "true") {
            mobileMenuBtn.click();
          }
        };

        const getFocusables = () =>
          Array.from(
            overlay.querySelectorAll(
              'input:not([disabled]), button:not([disabled]), a[href]:not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null);

        const trapFocus = (e) => {
          if (e.key !== "Tab" || !isOpen()) return;
          const items = getFocusables();
          if (!items.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        };

        const setOpen = (open) => {
          button.setAttribute("aria-expanded", String(open));
          button.setAttribute("aria-label", open ? "검색 닫기" : "검색 열기");
          overlay.classList.toggle("is-open", open);
          overlay.setAttribute("aria-hidden", open ? "false" : "true");
          if (open) overlay.removeAttribute("hidden");
          else overlay.setAttribute("hidden", "");
          header.classList.toggle("is-search-open", open);
          document.documentElement.classList.toggle("is-search-open", open);
          if (searchIcon) {
            searchIcon.setAttribute("icon", open ? "solar:close-circle-linear" : "solar:magnifer-linear");
          }
          if (open) {
            closeMobileMenuIfOpen();
            window.setTimeout(() => input?.focus(), 60);
          } else {
            button.focus();
          }
        };

        const isOpen = () => overlay.classList.contains("is-open");

        button.addEventListener("click", () => setOpen(!isOpen()));
        panel?.addEventListener("keydown", trapFocus);

        form?.addEventListener("submit", (e) => {
          e.preventDefault();
          if (input?.value.trim()) input.select();
        });

        overlay.querySelectorAll("[data-search-suggest]").forEach((tag) => {
          tag.addEventListener("click", (e) => {
            e.preventDefault();
            const term = tag.getAttribute("data-search-suggest") || tag.textContent.trim();
            if (input) input.value = term.replace(/^#/, "");
            input?.focus();
          });
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && isOpen()) {
            setOpen(false);
            button.focus();
          }
        });
      })();

      (function initFooterFamilyDropdown() {
        const wrap = document.getElementById("footer-family-wrap");
        const trigger = document.getElementById("footer-family-trigger");
        const panel = document.getElementById("footer-family-listbox");
        if (!wrap || !trigger || !panel) return;

        const setOpen = (open) => {
          trigger.setAttribute("aria-expanded", String(open));
          trigger.classList.toggle("footer-family-trigger--open", open);
          if (open) {
            panel.removeAttribute("hidden");
            panel.setAttribute("aria-hidden", "false");
          } else {
            panel.setAttribute("hidden", "");
            panel.setAttribute("aria-hidden", "true");
          }
        };

        trigger.addEventListener("click", (e) => {
          e.stopPropagation();
          setOpen(trigger.getAttribute("aria-expanded") !== "true");
        });

        panel.querySelectorAll("button.footer-family-option").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            setOpen(false);
          });
        });

        document.addEventListener("click", (e) => {
          if (!wrap.contains(e.target)) setOpen(false);
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") setOpen(false);
        });
      })();

      window.__handleContactSubmit = function (e) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());

        const toast = document.getElementById("contact-toast");
        toast.classList.remove("hidden");
        toast.textContent =
          "접수되었습니다. (시안) 실제 연동 시 메일/CRM 연동으로 대체됩니다. 개인정보는 문의 처리 목적으로만 사용됩니다.";

        // Minimal client-side validation feedback only
        if (!data.company || !data.name || !data.email || !data.message) return false;

        form.reset();
        return false;
      };

      /** 히어로: 영상 롤링 · 하단 네비 · 슬라이드별 카피 전환 */
      (function initHeroBackgroundVideo() {
        const heroMedia = document.querySelector("#hero .hero-media");
        const section = document.getElementById("hero");
        const heroCopy = document.getElementById("hero-copy");
        const heroHeadline = document.getElementById("hero-headline");
        const heroSubline = document.getElementById("hero-subline");
        const heroCtaRow = document.getElementById("hero-cta-row");
        const navSegments = document.getElementById("hero-video-nav-segments");
        const videos = [
          document.getElementById("hero-video-1"),
          document.getElementById("hero-video-2"),
          document.getElementById("hero-video-3"),
        ].filter(Boolean);
        if (!heroMedia || !section || videos.length < 3 || !heroCopy) return;

        const HERO_SLIDES = [
          {
            title: [
              { text: "클라우드에서 AI까지", gradient: false },
              { text: "기업의 내일을 설계하다", gradient: true },
            ],
            subline: {
              oneline: "클라우드 전환 · 데이터/AI 플랫폼 · 보안 강화 · 운영 자동화까지",
              twoline:
                "클라우드 전환 · 데이터/AI 플랫폼 ·<br />보안 강화 · 운영 자동화까지",
            },
            ctas: [
              { href: "#services", label: "핵심 서비스 보기", variant: "primary" },
              { href: "#cases", label: "고객성공사례", variant: "cases" },
            ],
          },
          {
            title: [
              { text: "세상을 연결하는 기술,", gradient: false },
              { text: "미래를 담는 클라우드", gradient: true },
            ],
            subline: {
              oneline: "안정성과 확장성을 갖춘 클라우드 서비스를 만나보세요",
              twoline: "안정성과 확장성을 갖춘<br />클라우드 서비스를 만나보세요",
            },
            ctas: [{ href: "#services", label: "클라우드 서비스 보기", variant: "primary" }],
          },
          {
            title: [
              { text: "복잡함은 지우고 성장은 빠르게,", gradient: false },
              { text: "스마트 IT 솔루션", gradient: true },
            ],
            /* 폰 ≤719px: 3줄 줄바꿈 (그 외 해상도는 title 유지) */
            titleNarrow: [
              { text: "복잡함은 지우고", gradient: false },
              { text: "성장은 빠르게", gradient: false },
              { text: "스마트 IT솔루션", gradient: true },
            ],
            subline: {
              oneline:
                "비즈니스의 핵심 흐름을 정확하게 진단하고 유기적으로 연결하는 맞춤형 IT 솔루션",
              twoline:
                "비즈니스의 핵심 흐름을 정확하게 진단하고<br />유기적으로 연결하는 맞춤형 IT 솔루션",
            },
            ctas: [
              { href: "#services", label: "Solution 서비스 전체보기", variant: "primary" },
            ],
          },
        ];

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const CROSSFADE_MS = reduceMotion ? 500 : 1200;
        const CROSSFADE_LEAD_SEC = reduceMotion ? 0.55 : 1.2;
        const COPY_SWITCH_MS = reduceMotion ? 0 : 280;

        const segmentEls = [];

        const buildNav = () => {
          if (!navSegments) return;
          const n = Math.min(videos.length, HERO_SLIDES.length);
          navSegments.innerHTML = "";
          segmentEls.length = 0;
          for (let i = 0; i < n; i++) {
            const seg = document.createElement("button");
            seg.type = "button";
            seg.className = "hero-video-nav__segment";
            seg.setAttribute("role", "tab");
            seg.setAttribute("aria-label", `배너 ${i + 1}`);
            seg.setAttribute("aria-selected", i === 0 ? "true" : "false");
            seg.dataset.slideIndex = String(i);
            seg.innerHTML = '<span class="hero-video-nav__segment-fill"></span>';
            seg.addEventListener("click", () => {
              const idx = Number(seg.dataset.slideIndex);
              if (!Number.isFinite(idx)) return;
              goToSlide(idx, true);
            });
            navSegments.appendChild(seg);
            segmentEls.push(seg);
          }
        };

        const updateNav = (idx, progressRatio) => {
          segmentEls.forEach((seg, i) => {
            const fill = seg.querySelector(".hero-video-nav__segment-fill");
            seg.classList.toggle("is-active", i === idx);
            seg.classList.toggle("is-complete", i < idx);
            seg.setAttribute("aria-selected", i === idx ? "true" : "false");
            if (!fill) return;
            if (i !== idx) fill.style.width = "0%";
            else fill.style.width = `${Math.min(100, Math.max(0, progressRatio * 100))}%`;
          });
        };

        const heroTitleNarrowMq = window.matchMedia("(max-width: 719px)");

        const getHeroTitleLines = (slide, slideIndex) => {
          if (slideIndex === 2 && slide.titleNarrow && heroTitleNarrowMq.matches) {
            return slide.titleNarrow;
          }
          return slide.title;
        };

        const titleLineHTML = (line, delay) => {
          const innerClass = line.gradient
            ? "hero-title-line__in block font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-100 via-brand-400 to-white 3xl:whitespace-nowrap"
            : "hero-title-line__in block font-bold 3xl:whitespace-nowrap";
          const delayClass = delay ? " hero-title-line--delay" : "";
          return `<span class="hero-title-line block w-full${delayClass}"><span class="${innerClass}">${line.text}</span></span>`;
        };

        const renderHeroCopy = (slideIndex) => {
          const slide = HERO_SLIDES[slideIndex];
          if (!slide || !heroHeadline || !heroSubline || !heroCtaRow) return;
          const titleLines = getHeroTitleLines(slide, slideIndex);
          heroHeadline.innerHTML = titleLines.map((line, i) => titleLineHTML(line, i > 0)).join("");
          const subOneline = heroSubline.querySelector(".hero-subline-oneline");
          const subTwoline = heroSubline.querySelector(".hero-subline-twoline");
          if (subOneline) subOneline.innerHTML = slide.subline.oneline;
          if (subTwoline) subTwoline.innerHTML = slide.subline.twoline;
          heroSubline.classList.toggle("hero-copy-desc--subline-long", slideIndex === 2);
          heroCtaRow.innerHTML = slide.ctas
            .map((cta) => {
              const cls =
                cta.variant === "cases"
                  ? "hero-cta-cases focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-[14px] text-sm font-semibold bg-white/6 hover:bg-white/10 border border-white/10 3xl:px-8 3xl:py-4 3xl:text-base 4xl:px-10 4xl:py-[18px] 4xl:text-[1.375rem] 4xl:gap-2.5"
                  : "hero-cta-primary focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-[14px] text-sm font-semibold bg-white text-ink-950 hover:bg-white/90 3xl:px-8 3xl:py-4 3xl:text-base 4xl:px-10 4xl:py-[18px] 4xl:text-[1.375rem] 4xl:gap-2.5";
              return `<a href="${cta.href}" class="${cls}">${cta.label}</a>`;
            })
            .join("");
        };

        const revealHeroCopy = () => {
          heroCopy.classList.remove("is-copy-switching");
          void heroCopy.offsetHeight;
          heroCopy.classList.add("is-revealing");
        };

        const swapHeroCopy = (slideIndex) => {
          if (reduceMotion) {
            renderHeroCopy(slideIndex);
            heroCopy.classList.add("is-revealing");
            return Promise.resolve();
          }
          heroCopy.classList.remove("is-revealing");
          heroCopy.classList.add("is-copy-switching");
          return new Promise((resolve) => {
            window.setTimeout(() => {
              renderHeroCopy(slideIndex);
              revealHeroCopy();
              resolve();
            }, COPY_SWITCH_MS);
          });
        };

        videos.forEach((v) => {
          v.defaultMuted = true;
          v.muted = true;
          v.loop = false;
          v.setAttribute("muted", "");
          v.setAttribute("playsinline", "");
          try {
            v.pause();
          } catch (_) {}
          try {
            v.load();
          } catch (_) {}
        });

        buildNav();

        let activeIdx = 0;
        let visible = false;
        let transitioning = false;
        let swapTimer = 0;
        let endLeadTriggered = false;
        const getActive = () => videos[activeIdx];
        const getNext = () => videos[(activeIdx + 1) % videos.length];

        const safePlay = (video) => {
          if (!video) return;
          const p = video.play?.();
          if (p && typeof p.catch === "function") p.catch(() => {});
        };

        const safePause = (video) => {
          if (!video) return;
          try {
            video.pause();
          } catch (_) {}
        };

        const clearCrossfadeClass = () => {
          heroMedia.classList.remove("is-crossfading");
        };

        const waitForCanPlay = (video, fallbackMs = 500) =>
          new Promise((resolve) => {
            if (!video) {
              resolve();
              return;
            }
            if (video.readyState >= 2) {
              resolve();
              return;
            }
            const done = () => resolve();
            video.addEventListener("canplay", done, { once: true });
            window.setTimeout(done, fallbackMs);
          });

        const clearTransitionTimers = () => {
          if (swapTimer) {
            clearTimeout(swapTimer);
            swapTimer = 0;
          }
        };

        const syncNavProgress = () => {
          const v = getActive();
          const dur = v.duration;
          const ratio =
            dur && Number.isFinite(dur) && dur > 0 ? Math.min(1, v.currentTime / dur) : 0;
          updateNav(activeIdx, ratio);
        };

        const finishTransition = (nextIdx) => {
          const prev = videos[activeIdx];
          const next = videos[nextIdx];
          prev.classList.remove("is-active", "is-incoming");
          next.classList.remove("is-incoming");
          next.classList.add("is-active");
          safePause(prev);
          try {
            prev.currentTime = 0;
          } catch (_) {}
          activeIdx = nextIdx;
          endLeadTriggered = false;
          syncNavProgress();
        };

        const goToSlide = async (targetIdx, fromUser = false) => {
          if (!visible || transitioning || targetIdx === activeIdx) return;
          if (targetIdx < 0 || targetIdx >= videos.length) return;
          const active = getActive();
          const next = videos[targetIdx];
          transitioning = true;
          if (fromUser) endLeadTriggered = true;
          clearTransitionTimers();
          clearCrossfadeClass();
          swapHeroCopy(targetIdx);
          try {
            next.currentTime = 0;
          } catch (_) {}
          next.classList.add("is-incoming");
          try {
            if (next.readyState < 2) next.load();
          } catch (_) {}
          await waitForCanPlay(next, 500);
          if (!visible) {
            transitioning = false;
            next.classList.remove("is-incoming");
            return;
          }
          safePlay(active);
          safePlay(next);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => heroMedia.classList.add("is-crossfading"));
          });
          swapTimer = window.setTimeout(() => {
            finishTransition(targetIdx);
            clearCrossfadeClass();
            safePause(active);
            safePlay(next);
            transitioning = false;
            if (!fromUser) endLeadTriggered = false;
          }, CROSSFADE_MS);
        };

        const startCrossfade = () => goToSlide((activeIdx + 1) % videos.length);

        const onVideoEnded = (e) => {
          if (!visible || transitioning || endLeadTriggered) return;
          if (e.currentTarget !== getActive()) return;
          startCrossfade();
        };

        videos.forEach((v) => {
          v.addEventListener("ended", onVideoEnded);
          v.addEventListener("canplay", () => {
            if (visible && v === getActive() && v.paused && !transitioning) safePlay(v);
          });
          v.addEventListener("timeupdate", () => {
            if (!visible || v !== getActive()) return;
            const dur = v.duration;
            if (!dur || !Number.isFinite(dur)) return;
            syncNavProgress();
            const upcoming = getNext();
            if (v.currentTime >= dur - 3) {
              try {
                if (upcoming.readyState < 2) upcoming.load();
              } catch (_) {}
            }
            if (!transitioning && !endLeadTriggered && v.currentTime >= dur - CROSSFADE_LEAD_SEC) {
              startCrossfade();
            }
          });
        });

        const syncHeroVisibility = () => {
          if (!visible) {
            clearTransitionTimers();
            clearCrossfadeClass();
            transitioning = false;
            endLeadTriggered = false;
            heroCopy.classList.remove("is-revealing", "is-copy-switching");
            videos.forEach((v) => {
              v.classList.remove("is-incoming");
              safePause(v);
            });
            return;
          }
          section.classList.add("is-section-active");
          renderHeroCopy(activeIdx);
          revealHeroCopy();
          syncNavProgress();
          const active = getActive();
          if (active.paused && !transitioning && active.readyState >= 2) safePlay(active);
        };

        if ("IntersectionObserver" in window) {
          const io = new IntersectionObserver(
            (entries) => {
              const hit = entries.find((e) => e.target === section);
              if (!hit) return;
              visible = hit.isIntersecting && hit.intersectionRatio > 0.08;
              syncHeroVisibility();
            },
            { threshold: [0, 0.06, 0.08, 0.12, 0.2] }
          );
          io.observe(section);
        } else {
          visible = true;
          syncHeroVisibility();
          safePlay(getActive());
        }

        const onHeroTitleNarrowChange = () => {
          if (!visible || activeIdx !== 2) return;
          renderHeroCopy(activeIdx);
          revealHeroCopy();
        };
        if (typeof heroTitleNarrowMq.addEventListener === "function") {
          heroTitleNarrowMq.addEventListener("change", onHeroTitleNarrowChange);
        } else if (typeof heroTitleNarrowMq.addListener === "function") {
          heroTitleNarrowMq.addListener(onHeroTitleNarrowChange);
        }
      })();

      /** 섹션 대타이틀: 뷰포트 진입 시 라인 단위 등장 · snap-section에 is-section-active 토글 */
      (function initSectionDisplayTitleReveal() {
        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const ids = ["services", "media", "cases", "growth", "contact-footer"];
        const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

        sections.forEach((el) => {
          if (reduceMotion) {
            el.classList.add("is-section-active");
            return;
          }
          if (!("IntersectionObserver" in window)) {
            el.classList.add("is-section-active");
            return;
          }
          const io = new IntersectionObserver(
            (entries) => {
              const hit = entries.find((e) => e.target === el);
              if (!hit || !hit.isIntersecting || hit.intersectionRatio < 0.1) return;
              el.classList.add("is-section-active");
              io.unobserve(el);
            },
            { threshold: [0, 0.08, 0.1, 0.14], rootMargin: "0px 0px -18% 0px" }
          );
          io.observe(el);
        });
      })();

      /** GROWTH REPORT 배경 영상: 섹션 노출 시 1회 재생 후 정지 */
      (function initGrowthBackgroundVideo() {
        const video = document.getElementById("growth-video");
        const section = document.getElementById("growth");
        if (!video || !section) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        video.defaultMuted = true;
        video.muted = true;
        video.loop = false;
        try {
          video.removeAttribute("loop");
        } catch (_) {}

        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        try {
          video.pause();
        } catch (_) {}

        if (reduceMotion) return;

        const stopAtEnd = () => {
          try {
            video.pause();
            video.loop = false;
          } catch (_) {}
        };

        video.addEventListener("ended", stopAtEnd);

        const bindNoLoop = () => {
          video.loop = false;
          try {
            video.removeAttribute("loop");
          } catch (_) {}
        };
        video.addEventListener("loadedmetadata", bindNoLoop);

        const safePlay = () => {
          const p = video.play?.();
          if (p && typeof p.catch === "function") p.catch(() => {});
        };

        const safePause = () => {
          try {
            video.pause();
          } catch (_) {}
        };

        let visible = false;

        const sync = () => {
          if (!visible) {
            safePause();
            return;
          }
          if (video.ended) return;
          safePlay();
        };

        video.addEventListener("canplay", sync);

        if ("IntersectionObserver" in window) {
          const io = new IntersectionObserver(
            (entries) => {
              const hit = entries.find((e) => e.target === section);
              if (!hit) return;
              visible = hit.isIntersecting && hit.intersectionRatio > 0.08;
              sync();
            },
            { threshold: [0, 0.06, 0.08, 0.15] }
          );
          io.observe(section);
        } else {
          visible = true;
          sync();
        }
      })();

      (function initMediaBgVideo() {
        const video = document.getElementById("media-bg-video");
        const section = document.getElementById("media");
        if (!video || !section) return;

        video.playbackRate = 0.72;
        video.addEventListener("loadedmetadata", () => {
          video.playbackRate = 0.72;
        });

        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        video.defaultMuted = true;
        video.muted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");

        let visible = false;

        const safePlay = () => {
          if (!video.paused) return;
          video.playbackRate = 0.72;
          const p = video.play?.();
          if (p && typeof p.catch === "function") p.catch(() => {});
        };

        const safePause = () => {
          try {
            video.pause();
          } catch (_) {}
        };

        const tryPlayIfVisible = () => {
          if (!visible) return;
          safePlay();
        };

        safePause();

        const io = new IntersectionObserver(
          (entries) => {
            const hit = entries.find((e) => e.target === section);
            if (!hit) return;
            visible = hit.isIntersecting && hit.intersectionRatio > 0.03;
            if (!visible) {
              safePause();
              return;
            }
            tryPlayIfVisible();
          },
          { threshold: [0, 0.03, 0.08, 0.15, 0.35, 0.6, 1] }
        );
        io.observe(section);

        window.addEventListener("scroll", tryPlayIfVisible, { passive: true });

        video.addEventListener("canplay", tryPlayIfVisible);
        video.addEventListener("loadeddata", tryPlayIfVisible);
      })();

      (function initSectionScrollEasing() {
        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        const mqMobileSnap = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        const getScrollPad = () => {
          const nh =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
            ) || 90;
          return nh;
        };
        /** 모바일: 이전 섹션 1~20px 비침 방지 — 헤더 높이 기준 + 2px 스냅 보정 */
        const snapTargetY = (sectionTop) => {
          const y = sectionTop - getScrollPad();
          return mqMobileSnap.matches ? Math.round(y + 2) : Math.round(y);
        };
        const EDGE = 14;
        const sections = () => [...document.querySelectorAll(".snap-section")];

        const layouts = () =>
          sections().map((el) => {
            const top = el.getBoundingClientRect().top + window.scrollY;
            const height = el.offsetHeight;
            return { el, top, bottom: top + height, height };
          });

        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

        /** 스크롤 이징: 거리 기반 duration + ease-out-quad */
        const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

        const durationFor = (dist) =>
          clamp(Math.round(110 + Math.sqrt(Math.abs(dist)) * 0.48), 170, 360);

        let animating = false;
        let rafId = 0;

        const animateTo = (targetY) => {
          const maxScroll = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
          );
          const end = clamp(targetY, 0, maxScroll);
          const start = window.scrollY;
          const dist = end - start;
          if (Math.abs(dist) < 2) return;

          animating = true;
          const dur = durationFor(dist);
          const t0 = performance.now();

          const tick = (now) => {
            const elapsed = now - t0;
            const p = clamp(elapsed / dur, 0, 1);
            const eased = easeOutQuad(p);
            window.scrollTo(0, start + dist * eased);
            if (p < 1) {
              rafId = window.requestAnimationFrame(tick);
            } else {
              animating = false;
              rafId = 0;
              window.scrollTo(0, end);
            }
          };
          rafId = window.requestAnimationFrame(tick);
        };

        const indexFromScroll = (scrollY, vp) => {
          const anchor = scrollY + getScrollPad() + 1;
          const L = layouts();
          if (!L.length) return 0;
          for (let i = 0; i < L.length; i++) {
            if (anchor >= L[i].top && anchor < L[i].bottom) return i;
          }
          if (anchor < L[0].top) return 0;
          return L.length - 1;
        };

        window.addEventListener(
          "wheel",
          (e) => {
            if (e.target.closest && e.target.closest(".gnb-mega__panel")) return;
            // allow interrupt for trackpad/continuous scroll
            if (animating) {
              if (rafId) cancelAnimationFrame(rafId);
              rafId = 0;
              animating = false;
            }
            const L = layouts();
            if (L.length < 2) return;

            const scrollY = window.scrollY;
            const vp = window.innerHeight;
            const idx = indexFromScroll(scrollY, vp);
            const r = L[idx];
            const delta = e.deltaY;
            // ignore tiny deltas (trackpads)
            if (Math.abs(delta) < 8) return;

            const tall = r.height > vp + 24;
            const atBottom = scrollY + vp >= r.bottom - EDGE;
            const atTop = scrollY <= r.top - getScrollPad() + EDGE;

            if (delta > 0) {
              if (tall && !atBottom) return;
              if (idx >= L.length - 1) return;
              e.preventDefault();
              animateTo(snapTargetY(L[idx + 1].top));
              return;
            }

            if (delta < 0) {
              if (tall && !atTop) return;
              if (idx <= 0) return;
              e.preventDefault();
              animateTo(snapTargetY(L[idx - 1].top));
            }
          },
          { passive: false }
        );

        document.addEventListener(
          "click",
          (e) => {
            if (e.defaultPrevented) return;
            if (e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = e.target.closest && e.target.closest('a[href^="#"]');
            if (!a) return;
            const raw = a.getAttribute("href");
            if (!raw || raw === "#") return;
            const targetEl = document.querySelector(raw);
            if (!targetEl) return;

            if (!sections().some((s) => s === targetEl || s.contains(targetEl))) return;

            e.preventDefault();
            const top = targetEl.getBoundingClientRect().top + window.scrollY;
            animateTo(snapTargetY(top));
          },
          true
        );

        window.addEventListener("keydown", (e) => {
          const el = e.target;
          if (
            el &&
            el.closest &&
            el.closest('input, textarea, select, [contenteditable="true"]')
          ) {
            return;
          }
          const isSpace = e.key === " " || e.code === "Space";
          /* 키보드: 스냅 섹션 간 이동(화살표/스페이스) 처리 */
          if (
            isSpace &&
            el &&
            el.closest &&
            el.closest('button, a[href], summary, [role="button"]')
          ) {
            return;
          }
          if (animating) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
            animating = false;
          }
          const L = layouts();
          if (L.length < 2) return;
          const scrollY = window.scrollY;
          const vp = window.innerHeight;
          const idx = indexFromScroll(scrollY, vp);
          const r = L[idx];
          const tall = r.height > vp + 24;
          const atBottom = scrollY + vp >= r.bottom - EDGE;
          const atTop = scrollY <= r.top - getScrollPad() + EDGE;

          const wantDown =
            e.key === "PageDown" ||
            e.key === "ArrowDown" ||
            (isSpace && !e.shiftKey);
          const wantUp =
            e.key === "PageUp" ||
            e.key === "ArrowUp" ||
            (isSpace && e.shiftKey);

          if (wantDown) {
            if (tall && !atBottom) return;
            if (idx >= L.length - 1) return;
            e.preventDefault();
            animateTo(snapTargetY(L[idx + 1].top));
          } else if (wantUp) {
            if (tall && !atTop) return;
            if (idx <= 0) return;
            e.preventDefault();
            animateTo(snapTargetY(L[idx - 1].top));
          }
        });
      })();

      (function initSectionQuickNav() {
        const nav = document.getElementById("section-quick-nav");
        if (!nav) return;

        const mqMobileSnap = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        const getScrollPad = () => {
          const nh =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
            ) || 90;
          return nh;
        };
        const snapTargetY = (sectionTop) => {
          const y = sectionTop - getScrollPad();
          return mqMobileSnap.matches ? Math.round(y + 2) : Math.round(y);
        };
        const links = [...nav.querySelectorAll(".sq-nav-link")];
        const btnUp = document.getElementById("section-quick-nav-up");
        const btnDown = document.getElementById("section-quick-nav-down");
        const btnUpIcon = btnUp && btnUp.querySelector("iconify-icon");
        const SQ_ICON_UP = "solar:alt-arrow-up-linear";
        const SQ_ICON_DOWN = "solar:alt-arrow-down-linear";
        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        /** 퀵네비 라벨 색: 밝은 배경 섹션에서 대비 전환 */
        const QUICK_NAV_LIGHT_BG = new Set(["services", "cases"]);

        const getSnaps = () => [...document.querySelectorAll(".snap-section")];

        const getActiveIndex = () => {
          const snaps = getSnaps();
          if (!snaps.length) return { activeId: "", index: 0 };

          const anchor = window.scrollY + getScrollPad() + 2;
          let activeId = snaps[snaps.length - 1].id;
          let index = snaps.length - 1;

          for (let i = 0; i < snaps.length; i++) {
            const sec = snaps[i];
            const top = sec.getBoundingClientRect().top + window.scrollY;
            const bottom = top + sec.offsetHeight;
            if (anchor >= top && anchor < bottom) {
              activeId = sec.id;
              index = i;
              break;
            }
          }

          return { activeId, index };
        };

        const scrollToSnapIndex = (index) => {
          const snaps = getSnaps();
          if (index < 0 || index >= snaps.length) return;
          const top = snapTargetY(
            snaps[index].getBoundingClientRect().top + window.scrollY
          );
          window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
        };

        const setActive = (id) => {
          links.forEach((a) => {
            const hid =
              a.getAttribute("data-sq-section") || (a.getAttribute("href") || "").replace(/^#/, "");
            const on = hid === id;
            a.classList.toggle("is-active", on);
            if (on) a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
          });
        };

        const scrollToPageTop = () => {
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        };

        const updateScrollButtons = (activeId, index) => {
          const snaps = getSnaps();
          const atHero = activeId === "hero";
          const atEnd = index >= snaps.length - 1;

          if (btnUp) {
            btnUp.classList.remove("hidden");
            if (atHero) {
              if (btnUpIcon) btnUpIcon.setAttribute("icon", SQ_ICON_DOWN);
              btnUp.setAttribute("aria-label", "다음 섹션으로 이동");
            } else {
              if (btnUpIcon) btnUpIcon.setAttribute("icon", SQ_ICON_UP);
              btnUp.setAttribute("aria-label", "페이지 최상단으로 이동");
            }
          }
          if (btnDown) btnDown.classList.toggle("hidden", atEnd || atHero);
        };

        const updateActive = () => {
          const snaps = getSnaps();
          if (!snaps.length) return;

          const { activeId, index } = getActiveIndex();

          setActive(activeId);
          nav.classList.toggle("sq-nav--light", QUICK_NAV_LIGHT_BG.has(activeId));
          updateScrollButtons(activeId, index);
        };

        if (btnUp) {
          btnUp.addEventListener("click", () => {
            const { activeId, index } = getActiveIndex();
            if (activeId === "hero") {
              const snaps = getSnaps();
              if (index < snaps.length - 1) scrollToSnapIndex(index + 1);
              return;
            }
            scrollToPageTop();
          });
        }
        if (btnDown) {
          btnDown.addEventListener("click", () => {
            const { index } = getActiveIndex();
            const snaps = getSnaps();
            if (index < snaps.length - 1) scrollToSnapIndex(index + 1);
          });
        }

        updateActive();
        window.addEventListener("scroll", updateActive, { passive: true });
        window.addEventListener("resize", updateActive);
      })();

      (function initMobileMenu() {
        const button = document.getElementById("mobile-menu-button");
        const menu = document.getElementById("mobile-menu");
        const header = document.getElementById("site-header");
        const menuIcon = button && button.querySelector(".header-menu-icon");
        const mqMobile = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        if (!button || !menu) return;

        const groups = menu.querySelectorAll("[data-mobile-nav-group]");

        const closeAllGroups = () => {
          groups.forEach((group) => {
            group.classList.remove("is-open");
            const toggle = group.querySelector("[data-mobile-nav-toggle]");
            const panel = group.querySelector(".mobile-nav__panel");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
            if (panel) panel.hidden = true;
          });
        };

        groups.forEach((group) => {
          const toggle = group.querySelector("[data-mobile-nav-toggle]");
          const panel = group.querySelector(".mobile-nav__panel");
          if (!toggle || !panel) return;
          toggle.addEventListener("click", () => {
            const wasOpen = group.classList.contains("is-open");
            closeAllGroups();
            if (!wasOpen) {
              group.classList.add("is-open");
              toggle.setAttribute("aria-expanded", "true");
              panel.hidden = false;
              try {
                menu.scrollTo({ top: 0, behavior: "smooth" });
              } catch (_) {
                menu.scrollTop = 0;
              }
            }
          });
        });

        const getMenuFocusables = () =>
          Array.from(
            menu.querySelectorAll(
              'a[href]:not([aria-disabled="true"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null && !el.closest("[hidden]"));

        const trapMenuFocus = (e) => {
          if (e.key !== "Tab" || !isOpen()) return;
          const items = getMenuFocusables();
          if (!items.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        };
        menu.addEventListener("keydown", trapMenuFocus);

        const setOpen = (open) => {
          button.setAttribute("aria-expanded", String(open));
          button.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
          menu.classList.toggle("hidden", !open);
          menu.setAttribute("aria-hidden", open ? "false" : "true");
          if (menuIcon) {
            menuIcon.setAttribute("icon", open ? "solar:close-circle-linear" : "solar:hamburger-menu-linear");
          }
          if (!open) closeAllGroups();
          if (header && mqMobile.matches) {
            header.classList.toggle("is-mobile-menu-open", open);
          }
          document.documentElement.classList.toggle("is-mobile-menu-open", open && mqMobile.matches);
          if (open) {
            const items = getMenuFocusables();
            if (items[0]) items[0].focus();
          } else {
            button.focus();
          }
        };

        const isOpen = () => button.getAttribute("aria-expanded") === "true";
        button.addEventListener("click", () => setOpen(!isOpen()));

        menu.querySelectorAll("[data-mobile-menu-link]").forEach((el) => {
          el.addEventListener("click", () => setOpen(false));
        });

        document.addEventListener("click", (e) => {
          if (!isOpen()) return;
          const t = e.target;
          if (button.contains(t) || menu.contains(t)) return;
          setOpen(false);
        });

        document.addEventListener("keydown", (e) => {
          if (e.key !== "Escape") return;
          if (!isOpen()) return;
          setOpen(false);
          button.focus();
        });

        window.addEventListener("resize", () => {
          if (!mqMobile.matches) {
            setOpen(false);
            if (header) header.classList.remove("is-mobile-menu-open");
            document.documentElement.classList.remove("is-mobile-menu-open");
          }
        });
      })();


(function initGnbMegaSheetHeightSync() {
        const mega = document.getElementById("gnb-mega");
        if (!mega) return;
        const sheet = mega.querySelector(".gnb-mega__sheet");
        if (!sheet) return;

        let lastH = 0;

        const maxPanelPx = () => {
          const nh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 90;
          return Math.max(160, Math.round(window.innerHeight - nh - 20));
        };

        const activePanel = () => {
          const items = mega.querySelectorAll(".gnb-mega__item[data-mega-item]");
          for (const li of items) {
            if (li.matches(":hover") || li.contains(document.activeElement)) {
              return li.querySelector(".gnb-mega__panel");
            }
          }
          return null;
        };

        const sync = () => {
          const inMega = mega.matches(":hover") || mega.contains(document.activeElement);
          if (!inMega) {
            sheet.style.height = "";
            sheet.style.minHeight = "";
            return;
          }
          const panel = activePanel();
          const cap = maxPanelPx();
          if (panel) {
            const h = Math.min(Math.max(Math.ceil(panel.offsetHeight || panel.getBoundingClientRect().height), 1), cap);
            lastH = h;
            sheet.style.height = h + "px";
            sheet.style.minHeight = h + "px";
            return;
          }
          if (lastH > 0) {
            sheet.style.height = lastH + "px";
            sheet.style.minHeight = lastH + "px";
          }
        };

        const raf2 = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

        mega.addEventListener("pointerenter", () => raf2(sync), true);
        mega.addEventListener("pointerleave", () => raf2(sync));
        mega.addEventListener("mouseover", () => requestAnimationFrame(sync));
        mega.addEventListener("focusin", () => raf2(sync), true);
        mega.addEventListener("focusout", () => raf2(sync), true);
        window.addEventListener("resize", () => raf2(sync), { passive: true });

        if ("ResizeObserver" in window) {
          const ro = new ResizeObserver(() => raf2(sync));
          mega.querySelectorAll(".gnb-mega__panel-inner").forEach((el) => ro.observe(el));
        }

        window.addEventListener("load", () => raf2(sync), { once: true });
        mega.addEventListener("wj-gnb-mega-sync", () => raf2(sync));
      })();

      /** GNB: 자료실·미디어룸·회사소개 — 서브 블록을 해당 대메뉴 글자 아래로 가로 정렬 */
      (function initGnbMegaSimpleAlign() {
        const items = [...document.querySelectorAll(".gnb-mega__item[data-mega-simple]")];
        if (!items.length) return;

        const alignOne = (item) => {
          const trigger = item.querySelector(".gnb-mega__trigger");
          const inner = item.querySelector(".gnb-mega__panel-inner");
          const shift = item.querySelector(".gnb-mega__panel-shift");
          if (!trigger || !inner || !shift) return;
          const tr = trigger.getBoundingClientRect();
          const box = inner.getBoundingClientRect();
          const cs = window.getComputedStyle(inner);
          const padL = parseFloat(cs.paddingLeft) || 0;
          const padR = parseFloat(cs.paddingRight) || 0;
          const contentLeft = box.left + padL;
          let ml = Math.round(tr.left - contentLeft);
          const sw = shift.offsetWidth;
          const maxMl = Math.max(0, inner.clientWidth - padL - padR - sw - 10);
          if (ml < 0) ml = 0;
          if (ml > maxMl) ml = maxMl;
          shift.style.marginLeft = ml + "px";
          item.closest("#gnb-mega")?.dispatchEvent(new CustomEvent("wj-gnb-mega-sync"));
        };

        items.forEach((item) => {
          item.addEventListener("mouseenter", () => requestAnimationFrame(() => alignOne(item)));
          item.addEventListener("focusin", () => requestAnimationFrame(() => alignOne(item)), true);
        });
        window.addEventListener(
          "resize",
          () => requestAnimationFrame(() => items.forEach(alignOne)),
          { passive: true }
        );
      })();

      /** Services: text → cards(빠르게 순차) → CTA 버튼 */
      (function initServicesScrollReveal() {
        const section = document.getElementById("services");
        if (!section) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const text = section.querySelector('[data-services-reveal="text"]');
        const cta = section.querySelector('[data-services-reveal="cta"]');
        const cards = [...section.querySelectorAll(".service-card.srvc-reveal")];

        const reveal = (el) => el && el.classList.add("is-revealed");

        const run = () => {
          reveal(text);

          const base = 220;
          const step = 110;

          cards.forEach((card, i) => {
            if (reduceMotion) return reveal(card);
            window.setTimeout(() => reveal(card), base + i * step);
          });

          if (reduceMotion) return reveal(cta);
          window.setTimeout(() => reveal(cta), base + cards.length * step + 260);
        };

        if (reduceMotion || !("IntersectionObserver" in window)) {
          run();
          return;
        }

        const io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            run();
            io.disconnect();
          },
          { threshold: 0.26, rootMargin: "0px 0px -24% 0px" }
        );
        io.observe(section);
      })();

      /** 공통: 스크롤 등장 — [data-reveal-seq] 섹션은 상→하 순차, 스태거 블록은 한 단계로 실행 후 카드 순차 */
      (function initGlobalScrollReveal() {
        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const supportsIO = "IntersectionObserver" in window;

        const reveal = (el) => el && el.classList.add("is-revealed");

        const readAttrNum = (src, name, fallback) => {
          const raw = src.getAttribute(name);
          if (raw === null || raw === "") return fallback;
          const n = Number(raw);
          return Number.isFinite(n) ? n : fallback;
        };

        const mqGrowthStagger = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        const readStaggerStep = (container) => {
          if (mqGrowthStagger.matches) {
            const m = readAttrNum(container, "data-reveal-stagger-step-m", NaN);
            if (Number.isFinite(m)) return m;
          }
          return readAttrNum(container, "data-reveal-stagger-step", 120);
        };

        function runStaggerContainer(container) {
          const children = [...container.querySelectorAll(".reveal-up")];
          const base = readAttrNum(container, "data-reveal-stagger-base", 90);
          const step = readStaggerStep(container);
          children.forEach((el, idx) => {
            if (reduceMotion) {
              reveal(el);
              return;
            }
            window.setTimeout(() => reveal(el), base + idx * step);
          });

          const owner = container.closest("[data-reveal-seq]");
          if (owner) {
            owner.dispatchEvent(
              new CustomEvent("reveal-seq-stagger", { bubbles: false, detail: { container } })
            );
          }
        }

        function staggerTailMs(container) {
          const n = container.querySelectorAll(".reveal-up").length;
          const base = readAttrNum(container, "data-reveal-stagger-base", 90);
          const step = readStaggerStep(container);
          return base + Math.max(0, n - 1) * step + 140;
        }

        function buildRevealSeqSteps(section) {
          const staggers = [...section.querySelectorAll("[data-reveal-stagger]")];
          const stSet = new Set(staggers);
          const nodes = [
            ...section.querySelectorAll("[data-reveal-stagger], .reveal-up:not([data-reveal-managed])"),
          ];
          const steps = [];
          for (const node of nodes) {
            if (node.matches("[data-reveal-stagger]")) {
              steps.push({ kind: "stagger", el: node });
              continue;
            }
            if (!node.matches(".reveal-up")) continue;
            if ([...stSet].some((st) => st !== node && st.contains(node))) continue;
            steps.push({ kind: "single", el: node });
          }
          return steps;
        }

        // 1) [data-reveal-stagger]: seq 섹션 안은 IO 생략(아래 섹션 순서에서 한 번에 실행)
        const staggerContainers = [...document.querySelectorAll("[data-reveal-stagger]")];
        staggerContainers.forEach((container) => {
          const children = [...container.querySelectorAll(".reveal-up")];
          children.forEach((c) => c.setAttribute("data-reveal-managed", "true"));

          const run = () => runStaggerContainer(container);

          if (reduceMotion || !supportsIO) {
            if (!container.closest("[data-reveal-seq]")) run();
            return;
          }
          if (container.closest("[data-reveal-seq]")) return;

          const io = new IntersectionObserver(
            (entries) => {
              if (!entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.12)) return;
              run();
              io.disconnect();
            },
            { threshold: [0, 0.12, 0.18], rootMargin: "0px 0px -18% 0px" }
          );
          io.observe(container);
        });

        // 2) [data-reveal-seq]: 문서 순서대로 단일 reveal → 스태거 묶음 → …
        const seqRoots = [...document.querySelectorAll("[data-reveal-seq]")];
        seqRoots.forEach((section) => {
          const steps = buildRevealSeqSteps(section);
          if (!steps.length) return;

          const seqStep = readAttrNum(section, "data-reveal-seq-step", 140);
          const seqLead = readAttrNum(section, "data-reveal-seq-base", 60);

          const runSeq = () => {
            let t = seqLead;
            steps.forEach((step) => {
              if (step.kind === "single") {
                if (reduceMotion) reveal(step.el);
                else window.setTimeout(() => reveal(step.el), t);
                t += seqStep;
              } else {
                if (reduceMotion) runStaggerContainer(step.el);
                else window.setTimeout(() => runStaggerContainer(step.el), t);
                t += staggerTailMs(step.el);
              }
            });
          };

          if (reduceMotion || !supportsIO) {
            runSeq();
            return;
          }

          const io = new IntersectionObserver(
            (entries) => {
              if (!entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.1)) return;
              runSeq();
              io.disconnect();
            },
            { threshold: [0, 0.1, 0.16], rootMargin: "0px 0px -14% 0px" }
          );
          io.observe(section);
        });

        // 3) 개별 reveal-up (seq에 속하지 않은 요소만)
        const singles = [
          ...document.querySelectorAll(".reveal-up:not([data-reveal-managed])"),
        ].filter((el) => !el.closest("[data-reveal-seq]"));

        if (reduceMotion || !supportsIO) {
          singles.forEach(reveal);
          return;
        }

        const ioSingle = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting || e.intersectionRatio < 0.12) return;
              reveal(e.target);
              ioSingle.unobserve(e.target);
            });
          },
          { threshold: [0, 0.12, 0.18], rootMargin: "0px 0px -18% 0px" }
        );
        singles.forEach((el) => ioSingle.observe(el));
      })();

      /** Growth report: 카드 등장과 동일 지연(기본 1초 간격)으로 카운트업 */
      (function initGrowthReportCounters() {
        const section = document.getElementById("growth");
        if (!section) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const nodes = [...section.querySelectorAll("[data-growth-count]")];
        if (!nodes.length) return;

        const staggerGrid = section.querySelector("[data-reveal-stagger]");
        const readNum = (name, fallback) => {
          if (!staggerGrid) return fallback;
          const raw = staggerGrid.getAttribute(name);
          if (raw === null || raw === "") return fallback;
          const n = Number(raw);
          return Number.isFinite(n) ? n : fallback;
        };
        const staggerBase = () => readNum("data-reveal-stagger-base", 0);
        const staggerStep = () => {
          if (window.matchMedia && window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))").matches && staggerGrid) {
            const m = staggerGrid.getAttribute("data-reveal-stagger-step-m");
            if (m !== null && m !== "") {
              const n = Number(m);
              if (Number.isFinite(n)) return n;
            }
          }
          return readNum("data-reveal-stagger-step", 650);
        };

        const fmt = (n, type) => {
          if (type === "won") return `${n.toLocaleString("ko-KR")}억`;
          if (type === "company") return `${n.toLocaleString("ko-KR")}`;
          if (type === "percent") return `${n.toLocaleString("ko-KR")}%`;
          if (type === "years") return `${n.toLocaleString("ko-KR")}년`;
          return n.toLocaleString("ko-KR");
        };

        const animateOne = (el) => {
          const target = Number(el.getAttribute("data-growth-count") || "0");
          const type = el.getAttribute("data-growth-format") || "";
          if (!Number.isFinite(target) || target <= 0) return;
          if (reduceMotion) {
            el.textContent = fmt(target, type);
            return;
          }

          const t0 = performance.now();
          const dur = 880;
          const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

          const tick = (now) => {
            const p = Math.min(1, (now - t0) / dur);
            const v = Math.round(target * easeOutCubic(p));
            el.textContent = fmt(v, type);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        };

        const runStaggered = () => {
          const base = staggerBase();
          const step = staggerStep();
          nodes.forEach((el, idx) => {
            if (reduceMotion) {
              animateOne(el);
              return;
            }
            window.setTimeout(() => animateOne(el), base + idx * step);
          });
        };

        const observeTarget = staggerGrid || section;

        if (!("IntersectionObserver" in window) || reduceMotion) {
          runStaggered();
          return;
        }

        if (section.matches("[data-reveal-seq]") && staggerGrid) {
          const onStagger = (ev) => {
            if (!ev.detail || ev.detail.container !== staggerGrid) return;
            runStaggered();
            section.removeEventListener("reveal-seq-stagger", onStagger);
          };
          section.addEventListener("reveal-seq-stagger", onStagger);
          return;
        }

        const io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.12)) return;
            runStaggered();
            io.disconnect();
          },
          { threshold: [0, 0.12, 0.18], rootMargin: "0px 0px -18% 0px" }
        );
        io.observe(observeTarget);
      })();

      /** Customer cases: 순차 등장(타이틀 좌측 정렬) → 느린 마퀴 롤링 */
      (function initCaseMarquee() {
        const track = document.getElementById("case-track");
        const casesSection = document.getElementById("cases");
        const rail = track && track.closest(".case-rail");
        const mqMobile = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        if (!track || !casesSection) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const INTRO_CARD_MS = 1350;
        const INTRO_STAGGER_MS = 110;
        const POST_INTRO_HOLD_MS = 1000;
        const MARQUEE_LOOP_SEC = 58;
        const MARQUEE_RAMP_FRAMES = 90;

        const isMobileMode = () => mqMobile.matches;

        const tuneCasesRevealTiming = () => {
          if (isMobileMode()) {
            casesSection.setAttribute("data-reveal-seq-base", "80");
            casesSection.setAttribute("data-reveal-seq-step", "150");
            return;
          }
          casesSection.setAttribute("data-reveal-seq-base", "90");
          casesSection.setAttribute("data-reveal-seq-step", "175");
        };
        tuneCasesRevealTiming();
        mqMobile.addEventListener("change", tuneCasesRevealTiming);

        let casesExperienceStarted = false;
        const CASES_DESKTOP_POST_TEXT_MS = 220;

        const CASES = [
          {
            id: "rental-1",
            title: "렌탈 통합 고객경험(CX) 플랫폼 고도화",
            period: "2025.09 – 2025.12",
            img: "./assets/case-rental-1.jpg",
            alt: "Analytics dashboard and data visualization on screen",
          },
          {
            id: "mobility-1",
            title: "모빌리티 데이터 허브 및 운영 자동화",
            period: "2025.04 – 2025.07",
            img: "./assets/case-mobility-1.jpg",
            alt: "Seoul cityscape at night — enterprise IT and urban infrastructure metaphor",
          },
          {
            id: "manufacturing-1",
            title: "제조 현장 관측(Observability) 체계 구축",
            period: "2024.11 – 2025.03",
            img: "./assets/case-manufacturing-1.jpg",
            alt: "최신식 설비와 로봇 자동화가 갖춰진 스마트 팩토리 생산 라인",
          },
          {
            id: "bio-1",
            title: "바이오 R&D 데이터 플랫폼 표준화",
            period: "2024.06 – 2024.10",
            img: "./assets/case-bio-1.jpg",
            alt: "Business professionals collaborating in a modern meeting space",
          },
          {
            id: "cpg-1",
            title: "소비재 수요예측·재고 최적화(데이터/AI)",
            period: "2024.01 – 2024.04",
            img: "./assets/case-cpg-1.jpg",
            alt: "Abstract global network and technology connectivity concept",
          },
          {
            id: "logistics-1",
            title: "물류 운영 대시보드 및 SLA 자동 리포팅",
            period: "2025.01 – 2025.03",
            img: "./assets/case-logistics-1.jpg",
            alt: "Team collaboration scene",
          },
          {
            id: "semiconductor-1",
            title: "반도체 공정 데이터 파이프라인 표준화",
            period: "2025.02 – 2025.06",
            img: "./assets/case-semiconductor-1.jpg",
            alt: "방진복을 착용한 엔지니어가 첨단 공정 설비를 점검하는 반도체 제조 현장",
          },
        ];

        const shuffle = (arr) => {
          const a = [...arr];
          for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
          }
          return a;
        };

        const cardHTML = (c, ariaHidden, introIndex = 0) => `
          <a
            href="#"
            data-empty-link
            class="case-marquee-card group flex w-[min(340px,85vw)] flex-col sm:w-[380px] xl:w-[430px] 3xl:w-[480px] 4xl:w-[520px] shrink-0 overflow-hidden rounded-3xl border border-black/[0.07] bg-white focus-ring outline-none"
            style="--case-intro-i: ${introIndex}"
            ${
              ariaHidden
                ? 'aria-hidden="true" tabindex="-1"'
                : 'aria-disabled="true"'
            }
            data-case-id="${c.id}"
          >
            <div class="relative h-56 shrink-0 overflow-hidden sm:h-[13.5rem] lg:h-[14rem] xl:h-[15rem] 2xl:h-[16rem] 3xl:h-[17.5rem] 4xl:h-72">
              <img class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" src="${c.img}" alt="${
          ariaHidden ? "" : c.alt
        }" loading="lazy" />
            </div>
            <div class="case-card-body flex flex-1 flex-col justify-center p-5 sm:p-6 xl:p-7 3xl:p-8 4xl:p-9 min-h-0">
              <div class="text-base font-semibold tracking-tight xl:text-lg 3xl:text-xl">${c.title}</div>
              <div class="mt-2 text-sm text-black/60 xl:text-base 3xl:mt-3 4xl:mt-3.5">기간: ${c.period}</div>
            </div>
          </a>
        `;

        const getTitleInset = () => {
          const titleIn = casesSection.querySelector(".hero-title-line__in");
          if (!titleIn || !rail) return null;
          const pad = Math.round(titleIn.getBoundingClientRect().left - rail.getBoundingClientRect().left);
          return Math.max(16, pad);
        };

        const getFirstCardSet = () =>
          [...track.querySelectorAll(".case-marquee-card")].filter(
            (el) => el.getAttribute("aria-hidden") !== "true"
          );

        let desktopMarqueeRaf = null;
        let desktopMarqueeOffset = 0;
        let desktopMarqueeRamp = 0;
        let desktopMarqueePaused = false;

        const teardownDesktopMarquee = () => {
          if (desktopMarqueeRaf) cancelAnimationFrame(desktopMarqueeRaf);
          desktopMarqueeRaf = null;
          desktopMarqueeOffset = 0;
          desktopMarqueeRamp = 0;
          track.style.transform = "";
        };

        const prepareLoopCards = () => {
          track.classList.add("case-track--hold");
          [...track.querySelectorAll(".case-marquee-card")].forEach((el) => {
            el.classList.add("is-intro-in");
          });
        };

        const startDesktopMarquee = () => {
          if (reduceMotion || isMobileMode()) return;
          teardownDesktopMarquee();
          desktopMarqueeOffset = 0;
          desktopMarqueeRamp = 0;
          track.style.transform = "translate3d(0, 0, 0)";

          const loopWidth = () => track.scrollWidth / 2;
          const maxSpeed = () => {
            const w = loopWidth();
            if (!w) return 0.5;
            return w / (MARQUEE_LOOP_SEC * 60);
          };

          const tick = () => {
            if (!isMobileMode() && !reduceMotion) {
              if (!desktopMarqueePaused) {
                const ramp = Math.min(desktopMarqueeRamp / MARQUEE_RAMP_FRAMES, 1);
                if (desktopMarqueeRamp < MARQUEE_RAMP_FRAMES) desktopMarqueeRamp += 1;
                const lw = loopWidth();
                if (lw > 0) {
                  desktopMarqueeOffset += maxSpeed() * ramp;
                  if (desktopMarqueeOffset >= lw) desktopMarqueeOffset -= lw;
                  track.style.transform = `translate3d(${-desktopMarqueeOffset}px, 0, 0)`;
                }
              }
              desktopMarqueeRaf = requestAnimationFrame(tick);
            }
          };

          desktopMarqueeRaf = requestAnimationFrame(tick);
        };

        const startMarqueeRolling = () => {
          if (rail) {
            rail.classList.remove("case-rail--intro-pending", "case-rail--intro-active");
            rail.classList.add("case-rail--rolling");
          }
          track.classList.remove("case-track--intro", "case-track--hold");
          track.classList.add("case-track--rolling");
          track.style.animation = "none";
          startDesktopMarquee();
        };

        const getIntroDuration = (count) =>
          INTRO_CARD_MS + Math.max(0, count - 1) * INTRO_STAGGER_MS;

        const runIntroSequence = () =>
          new Promise((resolve) => {
            const cards = getFirstCardSet();
            if (!cards.length) {
              resolve();
              return;
            }

            if (rail) {
              rail.classList.remove("case-rail--rolling");
              rail.classList.add("case-rail--intro-pending");
            }
            track.classList.remove("case-track--rolling");
            track.classList.add("case-track--intro");
            track.style.animation = "none";

            const inset = getTitleInset();
            if (inset != null) track.style.setProperty("--case-intro-pad", `${inset}px`);

            cards.forEach((el) => el.classList.remove("is-intro-in"));

            if (reduceMotion) {
              if (rail) rail.classList.add("case-rail--intro-active");
              cards.forEach((el) => el.classList.add("is-intro-in"));
              window.setTimeout(resolve, 120);
              return;
            }

            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(() => {
                if (rail) rail.classList.add("case-rail--intro-active");
                cards.forEach((el) => el.classList.add("is-intro-in"));
                window.setTimeout(resolve, getIntroDuration(cards.length));
              });
            });
          });

        let mobileAutoRaf = null;
        let mobileUserPause = false;
        let mobileOffscreen = false;
        let mobileTouchBound = false;
        let desktopHoverBound = false;
        let desktopDragBound = false;
        let desktopDragging = false;
        let desktopDragPointerId = null;
        let desktopDragStartX = 0;
        let desktopDragStartOffset = 0;
        let desktopDragMoved = false;
        const DESKTOP_DRAG_CLICK_PX = 6;

        const teardownMobileAutoScroll = () => {
          if (mobileAutoRaf) cancelAnimationFrame(mobileAutoRaf);
          mobileAutoRaf = null;
        };

        const setupMobileAutoScroll = () => {
          teardownMobileAutoScroll();
          if (!rail || !isMobileMode() || reduceMotion) return;

          const speed = 0.7;

          const tick = () => {
            if (!isMobileMode() || reduceMotion || !rail) {
              teardownMobileAutoScroll();
              return;
            }
            if (!mobileUserPause && !mobileOffscreen) {
              const loopWidth = track.scrollWidth / 2;
              if (loopWidth > 0) {
                rail.scrollLeft += speed;
                if (rail.scrollLeft >= loopWidth - 1) rail.scrollLeft -= loopWidth;
              }
            }
            mobileAutoRaf = requestAnimationFrame(tick);
          };

          if (!mobileTouchBound) {
            mobileTouchBound = true;
            rail.addEventListener("touchstart", () => {
              mobileUserPause = true;
            }, { passive: true });
            rail.addEventListener("touchend", () => {
              mobileUserPause = false;
            }, { passive: true });
            rail.addEventListener("touchcancel", () => {
              mobileUserPause = false;
            }, { passive: true });
            document.addEventListener("visibilitychange", () => {
              if (document.hidden) mobileOffscreen = true;
              else if (casesSection.getBoundingClientRect().bottom > 0 && casesSection.getBoundingClientRect().top < window.innerHeight) {
                mobileOffscreen = false;
              }
            });
          }

          if ("IntersectionObserver" in window) {
            const autoIo = new IntersectionObserver(
              (entries) => {
                mobileOffscreen = !entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.04);
              },
              { threshold: [0, 0.04, 0.1] }
            );
            autoIo.observe(casesSection);
          }

          mobileAutoRaf = requestAnimationFrame(tick);
        };

        const bindDesktopHoverPause = () => {
          if (!rail || desktopHoverBound) return;
          desktopHoverBound = true;
          rail.addEventListener("mouseenter", () => {
            if (!desktopDragging) desktopMarqueePaused = true;
          });
          rail.addEventListener("mouseleave", () => {
            if (!desktopDragging) desktopMarqueePaused = false;
          });
        };

        const bindDesktopPointerDrag = () => {
          if (!rail || desktopDragBound) return;
          desktopDragBound = true;

          const loopWidth = () => {
            const w = track.scrollWidth / 2;
            return w > 0 ? w : 0;
          };

          const applyDragOffset = (raw) => {
            const lw = loopWidth();
            if (!lw) return;
            desktopMarqueeOffset = ((raw % lw) + lw) % lw;
            track.style.transform = `translate3d(${-desktopMarqueeOffset}px, 0, 0)`;
          };

          const endDesktopDrag = (e) => {
            if (!desktopDragging) return;
            if (e && e.pointerId !== desktopDragPointerId) return;
            desktopDragging = false;
            desktopDragPointerId = null;
            rail.classList.remove("case-rail--dragging");
            if (!rail.matches(":hover")) desktopMarqueePaused = false;
            try {
              if (e) rail.releasePointerCapture(e.pointerId);
            } catch (_) {}
          };

          rail.addEventListener(
            "pointerdown",
            (e) => {
              if (isMobileMode() || reduceMotion) return;
              if (!track.classList.contains("case-track--rolling")) return;
              if (e.button !== 0) return;

              desktopDragging = true;
              desktopDragMoved = false;
              desktopDragPointerId = e.pointerId;
              desktopDragStartX = e.clientX;
              desktopDragStartOffset = desktopMarqueeOffset;
              desktopMarqueePaused = true;
              rail.classList.add("case-rail--dragging");
              try {
                rail.setPointerCapture(e.pointerId);
              } catch (_) {}
            },
            { passive: true }
          );

          rail.addEventListener(
            "pointermove",
            (e) => {
              if (!desktopDragging || e.pointerId !== desktopDragPointerId) return;
              const dx = e.clientX - desktopDragStartX;
              if (Math.abs(dx) > DESKTOP_DRAG_CLICK_PX) desktopDragMoved = true;
              applyDragOffset(desktopDragStartOffset - dx);
            },
            { passive: true }
          );

          rail.addEventListener("pointerup", endDesktopDrag);
          rail.addEventListener("pointercancel", endDesktopDrag);

          rail.addEventListener(
            "click",
            (e) => {
              if (!desktopDragMoved) return;
              e.preventDefault();
              e.stopPropagation();
              desktopDragMoved = false;
            },
            true
          );
        };

        const applyRailMode = () => {
          const mobile = isMobileMode();
          track.classList.toggle("case-track--touch", mobile);
          if (rail) {
            rail.classList.toggle("case-rail--touch", mobile);
            rail.classList.remove("case-rail--rolling", "case-rail--intro-pending", "case-rail--intro-active");
          }
          track.classList.remove("case-track--rolling", "case-track--intro", "case-track--hold");
          track.style.transform = "";
          track.style.animation = "";
          teardownDesktopMarquee();
          desktopDragging = false;
          desktopDragMoved = false;
          if (rail) rail.classList.remove("case-rail--dragging");
          if (!mobile) {
            teardownMobileAutoScroll();
            bindDesktopHoverPause();
            bindDesktopPointerDrag();
          } else {
            teardownMobileAutoScroll();
          }
        };

        const run = async () => {
          const list = shuffle(CASES);
          applyRailMode();
          track.innerHTML =
            list.map((c, i) => cardHTML(c, false, i)).join("") +
            list.map((c, i) => cardHTML(c, true, i)).join("");

          if (isMobileMode()) {
            await runIntroSequence();
            prepareLoopCards();
            await new Promise((resolve) => window.setTimeout(resolve, POST_INTRO_HOLD_MS));
            if (rail) {
              rail.classList.remove("case-rail--intro-pending", "case-rail--intro-active");
              rail.scrollLeft = 0;
            }
            track.classList.remove("case-track--intro", "case-track--hold");
            [...track.querySelectorAll(".case-marquee-card")].forEach((el) => {
              el.classList.add("is-intro-in");
            });
            setupMobileAutoScroll();
            return;
          }

          teardownMobileAutoScroll();
          await runIntroSequence();
          prepareLoopCards();
          await new Promise((resolve) => window.setTimeout(resolve, POST_INTRO_HOLD_MS));
          startMarqueeRolling();
        };

        mqMobile.addEventListener("change", () => {
          if (track.innerHTML.trim()) run();
        });

        if (reduceMotion || !("IntersectionObserver" in window)) {
          run();
          return;
        }

        const io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.06)) return;
            run();
            io.disconnect();
          },
          { threshold: [0, 0.06, 0.12] }
        );
        io.observe(casesSection);
      })();

