import pandas as pd
import numpy as np
from pathlib import Path

# 1. Load data awal
parent_dir = Path(__file__).parent.parent
file_path = parent_dir / 'dataset/heart_disease_dataset.csv'
df_orig = pd.read_csv(file_path)
df_orig.columns = df_orig.columns.str.strip()

def generate_smart_heart_data(df_base, target_total_rows=250):
    num_new_rows = target_total_rows - len(df_base)
    if num_new_rows <= 0: return df_base
    
    np.random.seed(42)
    last_id_num = int(df_base['Patient_ID'].iloc[-1][1:])
    new_ids = [f"P{str(i).zfill(3)}" for i in range(last_id_num + 1, last_id_num + num_new_rows + 1)]
    
    # --- PROSES GENERASI FITUR YANG BERKORELASI ---
    
    # 1. Age sebagai base
    age = np.random.randint(30, 75, num_new_rows)
    
    # 2. RestingBP berkorelasi dengan Age (tambah tua tambah tinggi peluang BP tinggi)
    # Base 110 + (faktor umur) + noise
    resting_bp = 100 + (age * 0.5) + np.random.randint(0, 30, num_new_rows)
    
    # 3. Cholesterol juga berkorelasi dengan Age dan BMI
    bmi = np.round(np.random.uniform(18.5, 35.0, num_new_rows), 1)
    cholesterol = 150 + (age * 0.6) + (bmi * 2) + np.random.randint(0, 50, num_new_rows)
    
    # 4. MaxHR berkorelasi negatif dengan Age (Rumus umum: 220 - age)
    max_hr = (220 - age) - np.random.randint(0, 40, num_new_rows)
    
    # 5. Kategorikal lainnya
    genders = ['Male', 'Female']
    gender_choice = np.random.choice(genders, num_new_rows)
    
    # Smoking & FamilyHistory dibuat random tapi nanti masuk hitungan risiko
    smoking = np.random.choice(['Yes', 'No'], num_new_rows, p=[0.35, 0.65])
    family_hist = np.random.choice(['Yes', 'No'], num_new_rows, p=[0.3, 0.7])
    
    # ChestPain & ExerciseAngina (Dibuat agar pasien risiko tinggi lebih mungkin dpt 'Asymptomatic' atau 'Typical')
    cp_options = ['Asymptomatic', 'Non-anginal', 'Atypical', 'Typical']
    chest_pain = np.random.choice(cp_options, num_new_rows)
    ex_angina = np.random.choice(['Yes', 'No'], num_new_rows)

    new_data = {
        'Patient_ID': new_ids,
        'Age': age,
        'Gender': gender_choice,
        'ChestPain': chest_pain,
        'RestingBP': resting_bp.astype(int),
        'Cholesterol': cholesterol.astype(int),
        'FastingBS': np.random.choice([0, 1], num_new_rows, p=[0.8, 0.2]),
        'MaxHR': max_hr.astype(int),
        'ExerciseAngina': ex_angina,
        'Smoking': smoking,
        'BMI': bmi,
        'FamilyHistory': family_hist,
        'StressLevel': np.random.randint(1, 11, num_new_rows),
        'PhysicalActivity': np.random.choice(['Rendah', 'Sedang', 'Tinggi'], num_new_rows)
    }
    
    df_new = pd.DataFrame(new_data)
    
    # --- LOGIKA TARGET (HEART DISEASE) YANG LEBIH TAJAM ---
    def determine_risk(row):
        score = 0
        # Faktor Umur & Gender (Pria > 45, Wanita > 55 lebih berisiko)
        if row['Gender'] == 'Male' and row['Age'] > 45: score += 1.5
        if row['Age'] > 60: score += 1.5
        
        # Klinis
        if row['RestingBP'] > 140: score += 1.5
        if row['Cholesterol'] > 240: score += 1.5
        if row['MaxHR'] < 130: score += 1 # Jantung lemah
        if row['ExerciseAngina'] == 'Yes': score += 2
        if row['ChestPain'] == 'Asymptomatic': score += 2 # Seringkali indikasi serius
        
        # Gaya Hidup
        if row['Smoking'] == 'Yes': score += 2
        if row['BMI'] > 30: score += 1.5
        if row['PhysicalActivity'] == 'Rendah': score += 1
        
        # Threshold yang lebih ketat untuk mengurangi False Positive
        # Jika score tinggi, peluang jadi 1 sangat besar
        if score > 8:
            prob = 0.95
        elif score > 5:
            prob = 0.7
        else:
            prob = 0.15
            
        return 1 if np.random.random() < prob else 0

    df_new['HeartDisease'] = df_new.apply(determine_risk, axis=1)
    
    return pd.concat([df_base, df_new], ignore_index=True)

# Eksekusi untuk 250 baris
df_final = generate_smart_heart_data(df_orig, target_total_rows=1000)
df_final.to_csv('dataset/heart_disease_dataset_augmented.csv', index=False)
print("Dataset v2 berhasil dibuat dengan korelasi fitur yang lebih kuat!")