import { BrandMark } from '../components/BrandMark';

export function Footer() {
  return (
    <footer className="footer">
      <div className="brand">
        <BrandMark />
        AUREL
      </div>
      <div>
        <p className="fine">
          Aurel is a fictional, independent educational exhibition celebrating the craft of
          mechanical watchmaking. It is inspired by the design language of the great Swiss
          maisons, including Rolex, but is not affiliated with, sponsored or endorsed by Rolex SA
          or any other watch manufacturer. All trademarks belong to their respective owners.
        </p>
        <p className="fine">
          The watch shown is an original, procedurally modelled concept. Technical descriptions
          are general and simplified; construction and materials vary by model.
        </p>
      </div>
    </footer>
  );
}
