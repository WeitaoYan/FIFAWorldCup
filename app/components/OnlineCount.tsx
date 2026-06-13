function OnlineCount() {
  return (
    <div class="online-badge" data-online-badge title="Fans online right now">
      <span class="online-badge-glow"></span>
      <span class="online-badge-inner">
        <span class="online-badge-dot">
          <span class="online-badge-dot-core"></span>
          <span class="online-badge-dot-ring"></span>
        </span>
        <span id="online-count" class="online-badge-number" aria-live="polite">-</span>
        <span class="online-badge-label">online</span>
      </span>
    </div>
  );
}

export { OnlineCount };
