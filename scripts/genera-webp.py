#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera varianti WebP delle fotografie di Bellavista Domus.

Per ogni JPEG in public/images produce:
  nome-480.webp   nome-900.webp   nome-1400.webp   nome.webp (larghezza piena)

I JPEG originali NON vengono toccati: restano come ripiego per browser
antichi e come archivio da cui rigenerare tutto in futuro.

Le larghezze scelte corrispondono a come le immagini vengono usate:
  480   miniature della galleria e schede dei dintorni su telefono
  900   la maggior parte dei riquadri su schermi normali
  1400  hero e immagini a piena larghezza su desktop
  piena solo per l'hero e le immagini grandi, per gli schermi ad alta densità

Non ingrandisce mai un'immagine: se l'originale è più piccolo della
larghezza richiesta, quella variante viene saltata.

RICHIEDE Python con la libreria Pillow:
    pip install Pillow
    python scripts/genera-webp.py

Non fa parte di "npm run build" ed è giusto così: le fotografie cambiano
raramente, e rigenerarle a ogni build allungherebbe ogni pubblicazione per
nulla. Va lanciato a mano quando si aggiunge o si sostituisce una foto.

DOPO averlo lanciato va aggiornato a mano l'elenco VARIANTI_IMMAGINI in
src/App.jsx, altrimenti il browser chiede file che non esistono (per le
foto nuove) o ne ignora di disponibili. Le larghezze generate sono
stampate a schermo alla fine di ogni riga.
"""

from pathlib import Path
from PIL import Image

# La cartella delle fotografie, ricavata dalla posizione di questo script,
# così funziona da qualunque directory venga lanciato.
CARTELLA = Path(__file__).resolve().parent.parent / "public" / "images"
LARGHEZZE = [480, 900, 1400]

# Qualità 82: sopra questa soglia il file cresce senza che l'occhio noti
# differenze su una fotografia. method=6 è la compressione più lenta e più
# efficiente: conta solo qui, una volta, non a ogni visita.
QUALITA = 82
METODO = 6


def converti(origine: Path):
    prodotti = []
    with Image.open(origine) as img:
        img = img.convert("RGB")
        piena = img.width

        # variante a larghezza piena
        fuori = origine.with_suffix(".webp")
        img.save(fuori, "WEBP", quality=QUALITA, method=METODO)
        prodotti.append((fuori, piena))

        for larghezza in LARGHEZZE:
            if larghezza >= piena:
                continue  # non ingrandire mai
            altezza = round(img.height * larghezza / piena)
            ridotta = img.resize((larghezza, altezza), Image.LANCZOS)
            fuori = origine.with_name(f"{origine.stem}-{larghezza}.webp")
            ridotta.save(fuori, "WEBP", quality=QUALITA, method=METODO)
            prodotti.append((fuori, larghezza))
    return prodotti


def kb(p: Path) -> float:
    return p.stat().st_size / 1024


def main():
    originali = sorted(CARTELLA.glob("*.jpg"))
    totale_prima = sum(kb(p) for p in originali)
    totale_webp_piena = 0.0
    totale_webp_tutte = 0.0

    print(f"{'file':26s} {'JPEG':>8s} {'WebP':>8s} {'risp.':>7s}   varianti")
    print("-" * 74)

    for origine in originali:
        prodotti = converti(origine)
        piena = [p for p, w in prodotti if p.name == origine.stem + ".webp"][0]
        risparmio = (1 - kb(piena) / kb(origine)) * 100
        totale_webp_piena += kb(piena)
        totale_webp_tutte += sum(kb(p) for p, _ in prodotti)
        larghezze = ", ".join(str(w) for _, w in sorted(prodotti, key=lambda x: x[1]))
        print(f"{origine.name:26s} {kb(origine):7.0f}K {kb(piena):7.0f}K {risparmio:6.0f}%   {larghezze}")

    print("-" * 74)
    print(f"{'TOTALE':26s} {totale_prima:7.0f}K {totale_webp_piena:7.0f}K "
          f"{(1 - totale_webp_piena / totale_prima) * 100:6.0f}%")
    print()
    print(f"  Peso di tutte le varianti generate: {totale_webp_tutte / 1024:.1f} MB")
    print(f"  (restano sul disco, ma ogni visitatore ne scarica una sola per immagine)")


if __name__ == "__main__":
    main()
