import json

with open('trend_analysis_output.json', 'r') as f:
    data = json.load(f)
    
print('Regional distribution for trends:')
for i, trend in enumerate(data['trends']):
    print(f'\nTrend {i+1}: {trend["name"]}')
    for region in trend['regional_distribution'][:3]:
        print(f'  {region["country"]}: {region["percentage"]*100:.1f}%')
