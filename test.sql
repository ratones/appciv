select 
n.nr_registru,
(select a.tip from n_tip a where a.id_tip = n.id_tip) tip,
(select a.varianta from n_varianta a where a.id_varianta = n.id_varianta) varianta,
(select a.versiune from n_versiune a where a.id_versiune = n.id_versiune) versiune,
(select a.marca from n_marci a where a.id_marca = n.id_marca) marca,
(select a.denumire_comerciala from n_denumire_comerciala a where a.id_dencom = n.id_dencom) denumire_comerciala,
(select a.categorie_eu from n_categorie_eu a where a.id_categorie_eu = n.id_categorie_eu) categorie,
(select a.categorie_folosinta from n_categorie_folosinta a where a.id_categorie_folosinta = n.id_categorie_folosinta) categorie_folosinta,
(select a.caroserie from n_caroserie a where a.id_caroserie = n.id_caroserie) caroserie
from nr_national_registru n
where
id_varianta is not null
and 
nr_registru in
(
select nr_registr from omfisa3_nou 
where
masa < 1200
)