import pandas as pd

dataset_name = 'vaccination_vs_income'

with open('table.html','r') as f:
	html_data = f.read()

df = pd.read_html(html_data)[0]
print(df)
df.to_csv(f'{dataset_name}.csv',index=False)