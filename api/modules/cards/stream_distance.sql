--explain analyze

select "filtered_cards"."distance"
,		"card".*
from 	"card"
join (
	select "card"."id" as "card"
	,		min(
				ST_distance(
					ST_transform(ST_SetSRID("location"."geometry", 4326), 28992),
					ST_transform(ST_SetSRID(ST_geomFromGeoJSON('{"type": "Point","coordinates":[4.63648176,52.38572954]}'), 4326), 28992)
				)
			) as "distance"
	from 	"card"
	join	"card_location"
	on		"card_location"."card" = "card"."id"
	join	"location"
	on 		"location"."id" = "card_location"."location"
	join	"user_service_max_distance"
	on		"user_service_max_distance"."service" = "card"."service"
	and		"user_service_max_distance"."user" = '2522fab2-204c-491f-9baf-f354c3a86fdf'
	and		"user_service_max_distance"."is_enabled" = true
	where	coalesce("card"."expires_at",'infinity') > 'now'
	and		coalesce("card"."published_at",'-infinity') < 'now'
	and		ST_DWithin(
				ST_transform(ST_SetSRID("location"."geometry", 4326), 28992),
				ST_transform(ST_SetSRID(ST_geomFromGeoJSON('{"type": "Point","coordinates":[4.63648176,52.38572954]}'), 4326), 28992),
				"user_service_max_distance"."max_distance"
			)
	group by "card"."id"
) as "filtered_cards"
on "filtered_cards"."card" = "card"."id"
order by "distance" asc
limit 50
;
