# BE READY — application d'entraînement (PWA)

Application personnelle de J, publiée sur GitHub Pages. **Dépôt public : aucune donnée personnelle,
aucune clé, aucun identifiant ne doit y entrer** (les journaux d'entraînement vivent dans le
navigateur du téléphone et dans Firebase, jamais ici).

## Fichiers
- `index.html` — toute l'app : HTML, CSS, module JS, et **trois blocs JSON** intégrés :
  `moteur-catalogue-data` (exercices), `moteur-templates-data` (séances), `moteur-periodisation-data`.
- `sport-pwa-sw.js` (service worker, réseau d'abord) · `sport-pwa-manifest.json`.
- Documents de référence hors dépôt : dossier « BE READY » du Mac de J — programme d'exécution
  (`BE_READY_Programme_v5_XX.md`, fait foi pour les décisions), manuel source (doctrine), journal des
  versions ; projet claude.ai « BE READY » — **`claude/etat_physique.md`** (état du fil, boîte d'entrée,
  points ouverts, chantiers app restants). À relire en début de session, à mettre à jour en fin.

## Règles de modification (non négociables)
1. **JSON : parser puis re-sérialiser** (`json.loads` → modification → `json.dumps(ensure_ascii=False, indent=2)`).
   Jamais de remplacement de texte dans un bloc JSON. Le catalogue fait un aller-retour exact à ce format.
2. Code JS : remplacements exacts et uniques (vérifier le nombre d'occurrences avant de remplacer).
3. **Versionner chaque édition** : `APP_VERSION`, `APP_VERSION_DATE`, `APP_VERSION_NOTE` (la note
   décrit la version en cours et garde seulement la précédente ; l'historique complet est dans git).
   Toute modification du catalogue incrémente `meta.version` du catalogue et l'explique dans `meta.description`.
4. **Tester avant de publier** : `bash tests/run.sh` (JSON, `node --check`, rendu Chromium de toutes les
   séances sur 6 cas). Une différence avec `tests/baseline/` doit être **voulue et expliquée** ; alors
   seulement `bash tests/run.sh --update`. Zéro erreur JS tolérée.
5. Ne jamais casser les données existantes du téléphone : nouvelles clés avec valeur par défaut,
   migrations idempotentes et signalées (drapeau `migration…` dans l'état).
6. Après publication, mettre à jour la copie `index.html` du dossier « BE READY » du Mac.
7. L'app fait foi en cas de divergence avec le programme ; signaler toute divergence trouvée.

## Repères de fond (décisions de J, à ne pas rediscuter sans lui)
- Objectifs : **opérateur qui vieillit bien + ferme**. Plus de St Astier ni de MMA ; la condition
  physique de combat reste visée (combat non volontaire), sans objectif de compétition.
- Poignet G : arthrose post-rupture ligamentaire, non opérable. Attelle autorisée par le médecin.
  Restrictions médicales datées dans `M_RESTRICTIONS_DEFAUT` (seuils `poignet_G` 1 et 2 du catalogue).
- Front squat **retiré définitivement** ; squat du RSA = **Zercher, repère interne non opposable**.
- Tests en **3RM, jamais 1RM**. Genou G : course par paliers R1-R6, échelle de gêne 0-10 (plafond 3).
- Un créneau coupé par une restriction s'affiche « Absent (restriction) », ne bloque pas la séance,
  et n'est remplacé que par un exercice du même pattern.
- Distinguer **référencé / adaptation assumée / invention** dans tout texte affiché. Ne jamais
  présenter un chiffre construit comme un standard.
