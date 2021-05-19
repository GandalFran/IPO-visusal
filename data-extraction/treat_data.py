
df_name = 'trust_in_doctors_vs_vaccine_disagreement.csv'

df['Total population (Gapminder)'] = df['Total population (Gapminder)'].apply(lambda x: float(x.replace(' million','000000')) )


df_name = 'confidence_vs_importance.csv'