/**
 * 시안1 반응형 브레이크포인트 (단일 기준)
 *
 * - 폰: max-width 719px
 * - iPad Mini 세로: width 768px + portrait
 * - iPad Air 세로: width 820px + portrait
 * - iPad Pro 세로: width 1024px + portrait
 */
const MQ_IPAD_MINI_PORTRAIT = "(width: 768px) and (orientation: portrait)";
const MQ_IPAD_AIR_PORTRAIT = "(width: 820px) and (orientation: portrait)";
const MQ_IPAD_PRO_PORTRAIT = "(width: 1024px) and (orientation: portrait)";
const MQ_PAD_PORTRAIT = `((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))`;
const MQ_PHONE = "(max-width: 719px)";
const MQ_MOBILE = `${MQ_PHONE}, ${MQ_PAD_PORTRAIT}`;
const MQ_MOBILE_AT = `@media ${MQ_MOBILE}`;
const MQ_DESKTOP_720_EXCL_PAD = `(min-width: 720px) and (not ((width: 768px) and (orientation: portrait))) and (not ((width: 820px) and (orientation: portrait))) and (not ((width: 1024px) and (orientation: portrait)))`;
const MQ_DESKTOP_720_AT = `@media ${MQ_DESKTOP_720_EXCL_PAD}`;

module.exports = {
  MQ_IPAD_MINI_PORTRAIT,
  MQ_IPAD_AIR_PORTRAIT,
  MQ_IPAD_PRO_PORTRAIT,
  MQ_PAD_PORTRAIT,
  MQ_PHONE,
  MQ_MOBILE,
  MQ_MOBILE_AT,
  MQ_DESKTOP_720_EXCL_PAD,
  MQ_DESKTOP_720_AT,
};
