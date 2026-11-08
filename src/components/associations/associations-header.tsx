interface AssociationsHeaderProps {
  totalCount?: number;
}

export function AssociationsHeader({ totalCount }: AssociationsHeaderProps) {
  return (
    <div className="associations-header">
      {/* Overline with red accent rules */}
      <div className="associations-overline">
        <span className="accent-rule" aria-hidden="true" />
        <span className="overline-text">WARISAN PERSILATAN NUSANTARA</span>
        <span className="accent-rule" aria-hidden="true" />
      </div>

      {/* Main Teko Display Title */}
      <h1 className="associations-title">
        <span className="title-white">DIREKTORI BADAN &amp; </span>
        <span className="title-crimson">PERGURUAN SILAT</span>
      </h1>

      {/* Narrative Heritage Paragraph */}
      <p className="associations-narrative">
        Koleksi rasmi 26 lambang dan profil persatuan, perguruan pengasas teras, dan badan induk persilatan yang membentuk landskap Silat Seni dan Silat Olahraga di peringkat kebangsaan dan antarabangsa.
      </p>

      {/* Mandatory National Quote Callout */}
      <div className="associations-quote" role="figure" aria-label="FighterX National Silat Quote">
        <span className="quote-rule" aria-hidden="true" />
        <span className="quote-text">
          &mdash; <span className="quote-red">&ldquo;</span>Semangat Juang. Jiwa Malaysia.<span className="quote-red">&rdquo;</span> &mdash;
        </span>
        <span className="quote-rule" aria-hidden="true" />
      </div>
    </div>
  );
}
