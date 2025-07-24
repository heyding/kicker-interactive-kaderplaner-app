# Kicker Punkte Vorhersage - Berechnungslogik

## Überblick
Die **Expected_Points_Kicker** werden aus den Saison Vorhersagedaten von Kickbase und Sorare berechnet und mit positionsspezifischen Faktoren korrigiert, um eine möglichst genaue Prognose für die Kicker-Managerspiel-Punkte zu erstellen.

## Datengrundlage

### Eingangswerte
- **Expected_Points_Kickbase**: Erwartete Punkte aus der LI Kickbase-Saisonranking Vorhersage
- **Expected_Points_Sorare**: Erwartete Punkte aus der LI Sorare-Saisonranking Vorhersage
- **Position**: Spielerposition (FORWARD, MIDFIELDER, DEFENDER, GOALKEEPER)

### Datenvalidierung
Fehlende Werte werden automatisch als "NaN" gesetzt:
```python
if 'Expected_Points_Kickbase' not in entry:
    entry['Expected_Points_Kickbase'] = 'NaN'
if 'Expected_Points_Sorare' not in entry:
    entry['Expected_Points_Sorare'] = 'NaN'
```

## Positionsspezifische Faktoren

Die Berechnungsfaktoren basieren auf Analyseergebnissen von Spielern mit über 32 Einsätzen:

| Position | Kickbase-Faktor | Sorare-Faktor | Kombiniert-Faktor | Abweichung |
|----------|-----------------|---------------|-------------------|------------|
| **FORWARD** | 17.5 | 8.0 | 25.5 | 0.013 (beste Genauigkeit) |
| **MIDFIELDER** | 17.8 | 8.1 | 25.9 | 0.017 |
| **DEFENDER** | 18.2 | 8.3 | 26.5 | 0.021 |
| **GOALKEEPER** | 18.5 | 8.5 | 27.0 | 0.022 (höchste Abweichung) |

### Faktor-Logik
- **Höhere Faktoren** werden bei Positionen mit historisch höherer Abweichung angewendet
- **Zweck**: Reduzierung der Expected Points bei ungenaueren Vorhersagen
- **Fallback**: Bei unbekannter Position werden FORWARD-Faktoren verwendet (beste Genauigkeit)

### Erläuterung der Abweichungswerte

Die **Abweichung** in der Tabelle bezieht sich auf die **statistische Genauigkeit** der Vorhersagen für jede Position, basierend auf historischen Daten von Spielern mit über 32 Einsätzen.

#### Was bedeutet die Abweichung?
Die Abweichungswerte sind **Fehlermaße**, die angeben, wie stark die vorhergesagten Expected Points im Durchschnitt von den tatsächlich erzielten Punkten abweichen:

- **FORWARD: 0.013** = **1.3%** durchschnittliche Abweichung (beste Vorhersagegenauigkeit)
- **MIDFIELDER: 0.017** = **1.7%** durchschnittliche Abweichung
- **DEFENDER: 0.021** = **2.1%** durchschnittliche Abweichung  
- **GOALKEEPER: 0.022** = **2.2%** durchschnittliche Abweichung (schlechteste Vorhersagegenauigkeit)

#### Warum unterschiedliche Abweichungen?

**Stürmer** sind am besten vorhersagbar, weil:
- Klare Leistungsindikatoren (Tore, Assists)
- Weniger situationsabhängig
- Konsistentere Punkteverteilung

**Torhüter** sind am schlechtesten vorhersagbar, weil:
- Stark abhängig von Teamleistung
- Wenige, aber sehr punktereiche Aktionen (gehaltene Elfmeter, etc.)
- Höhere Varianz in der Punkteverteilung

#### Auswirkung auf die Faktoren
Die **höheren Faktoren** bei Positionen mit höherer Abweichung führen zu:
- **Konservativeren Vorhersagen** (niedrigere Expected Points)
- **Reduzierten Überschätzungen** bei unzuverlässigeren Positionen
- **Ausgleich der unterschiedlichen Vorhersagequalität**

So wird die systematische Ungenauigkeit bei bestimmten Positionen durch die Faktoren kompensiert.

## Berechnungsalgorithmus

### Fall 1: Keine Daten verfügbar
```python
if kickbase_points == 'NaN' and sorare_points == 'NaN':
    Expected_Points_Kicker = 0
```

### Fall 2: Nur Kickbase-Daten verfügbar
```python
if kickbase_points != 'NaN' and sorare_points == 'NaN':
    Expected_Points_Kicker = round(kickbase_points / kickbase_faktor)
```

### Fall 3: Nur Sorare-Daten verfügbar
```python
if kickbase_points == 'NaN' and sorare_points != 'NaN':
    Expected_Points_Kicker = round(sorare_points / sorare_faktor)
```

### Fall 4: Beide Datenquellen verfügbar
```python
if kickbase_points != 'NaN' and sorare_points != 'NaN':
    Expected_Points_Kicker = round((kickbase_points + sorare_points) / kombiniert_faktor)
```

## Zusätzliche Metriken

### Expected_Points_Per_Game_Kicker
Berechnung der erwarteten Punkte pro Spieltag:
```python
Expected_Points_Per_Game_Kicker = Expected_Points_Kicker / 34
```
- **34**: Anzahl der Spieltage in der Saison
- **Rundung**: Auf 2 Nachkommastellen

## Beispielberechnung

### Beispiel: Stürmer mit beiden Datenquellen
```
Spieler: Harry Kane
Position: FORWARD
Expected_Points_Kickbase: 5655
Expected_Points_Sorare: 2432

Berechnung:
Expected_Points_Kicker = round((5655 + 2432) / 25.5) = round(8087 / 25.5) = round(317.14) = 317
Expected_Points_Per_Game_Kicker = 317 / 34 = 9.32
```

### Beispiel: Torwart nur mit Kickbase-Daten
```
Spieler: Peter Keeper
Position: GOALKEEPER
Expected_Points_Kickbase: 300
Expected_Points_Sorare: NaN

Berechnung:
Expected_Points_Kicker = round(300 / 18.5) = round(16.22) = 16
Expected_Points_Per_Game_Kicker = 16 / 34 = 0.47
```

## Zweck und Anwendung

### Ziel der Berechnung
- **Vereinheitlichung** verschiedener Prognosesysteme
- **Positionsspezifische Anpassung** für höhere Genauigkeit
- **Robuste Vorhersage** auch bei fehlenden Daten

### Verwendung im System
Die berechneten Expected_Points_Kicker dienen als Grundlage für:
- Performance-Bewertung der Spieler
- Vergleich mit tatsächlich erzielten Punkten
- Strategische Entscheidungen im Managerspiel

## Technische Implementierung

### Positionsbestimmung
```python
position = entry.get('Position', 'MIDFIELDER')  # Fallback auf MIDFIELDER
factors = position_factors.get(position, position_factors['FORWARD'])
```

### Rundung
Alle Endergebnisse werden auf ganze Zahlen gerundet, um praktikable Werte zu erhalten.

### Fehlerbehandlung
Das System ist robust gegen fehlende Daten und unbekannte Positionen