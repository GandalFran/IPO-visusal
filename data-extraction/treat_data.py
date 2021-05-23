import json
import pandas as pd

input_folder = 'raw'
output_folder = 'parsed'

# parse df 1
df_name = 'trust_in_doctors_vs_vaccine_disagreement.csv'
df = pd.read_csv(f'{input_folder}/{df_name}')
df = df.rename(columns={
		'Country':'country',
		'Share of people who trust doctors and nurses in their countrypercent':'doctor_trust_percentage',
		'Share of people who disagree vaccines are safepercent':'vaccine_disagreement_percentage',
		'Continent':'continent'
	})

del df['continent']
for c in ['doctor_trust_percentage', 'vaccine_disagreement_percentage']:
	df[c] = df[c].fillna('0').apply(lambda x: float(x.replace('%','').replace('<','')))
df = df.dropna()

data = df.to_dict(orient='records')
with open(f'{output_folder}/{df_name}'.replace('csv','json'), 'w+') as f:
	f.write(json.dumps(data,indent=4))



# parse df 2
df_name = 'confidence_vs_importance.csv'
df = pd.read_csv(f'{input_folder}/{df_name}')
df = df.rename(columns={
		'Country': 'country', 
		'“Overall I do not think vaccines are effective”percent': 'vaccines_no_efective_percentage',
	    '“Vaccines are not important for children to have”percent': 'vaccines_not_important_percentage',
	    'Total population (Gapminder)': 'population'
	})

df['population'] = df['population'].apply(lambda x: float(x.replace(' million','000000').replace(' billion', '000000000000').replace('.','') if isinstance(x,str) and ('million' in x or 'billion' in x) else x))
for c in ['vaccines_no_efective_percentage', 'vaccines_not_important_percentage']:
	df[c] = df[c].fillna('0').apply(lambda x: float(x.replace('%','').replace('<','')))

df = df.dropna()


data = df.to_dict(orient='records')
with open(f'{output_folder}/{df_name}'.replace('csv','json'), 'w+') as f:
	f.write(json.dumps(data,indent=4))



# parse df 3
df_name = 'preventable_child_deaths_from_vaccination.csv'
df = pd.read_csv(f'{input_folder}/{df_name}')
df = df.rename(columns={
		'Country': 'country', 
		'Avertable deaths from rotavirusavertable deaths': 'deaths_for_no_vaccination'
	})

df = df.dropna()

data = df.to_dict(orient='records')
with open(f'{output_folder}/{df_name}'.replace('csv','json'), 'w+') as f:
	f.write(json.dumps(data,indent=4))


# parse df 4
df_name = 'vaccination_vs_income.csv'
df = pd.read_csv(f'{input_folder}/{df_name}')
df = df.rename(columns={
		'Country': 'country', 
		'Total population (Gapminder).1': 'population',
		'DTP3 coveragepercent.1': 'vaccine_coverage',
		'GDP per capita (int.-$)2011 international-$.1': 'gdp_per_capita',
	})[['country','vaccine_coverage','gdp_per_capita', 'population']].iloc[1:].dropna().reset_index(drop=True)

df.vaccine_coverage = df.vaccine_coverage.apply(lambda x: float(x.replace('%','')))
df.gdp_per_capita = df.gdp_per_capita.apply(lambda x: float(x.replace(',','').replace('$','')))
df.population = df.population.apply(lambda x: int(x.replace('.','').replace(' million','000000').replace(' billion','000000000')))

 

print(df)

data = df.to_dict(orient='records')
with open(f'{output_folder}/{df_name}'.replace('csv','json'), 'w+') as f:
	f.write(json.dumps(data,indent=4))

