import pandas as pd

output_folder = 'raw'
dataset_name = 'vaccination_vs_income'

with open('table.html','r') as f:
	html_data = f.read()

df = pd.read_html(html_data)[0]
df.to_csv(f'{output_folder}/{dataset_name}.csv',index=False)