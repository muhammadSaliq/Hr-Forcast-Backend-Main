#!/usr/bin/env python
# coding: utf-8

# In[8]:


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
get_ipython().run_line_magic('matplotlib', 'inline')
import warnings
warnings.filterwarnings('ignore')


# In[7]:


pip install -U imbalanced-learn --user


# In[9]:


import imblearn


# In[10]:


data= pd.read_csv(r"C:\Users\hp\Desktop\archive\WA_Fn-UseC_-HR-Employee-Attrition.csv")


# In[11]:


data


# In[12]:


data.head()


# In[ ]:


pd.set_option('display.max_columns',None)


# In[ ]:


data.head()


# In[ ]:


data.info()


# In[ ]:


data.describe()


# In[ ]:


print(data.duplicated().value_counts())
data.drop_duplicates(inplace=True)
print(len(data))


# In[ ]:


data.isnull().sum()


# ##### Target Variable

# In[ ]:


plt.figure(figsize=(15,5))
plt.rc("font", size=14)
sns.countplot(y='Attrition',data=data, palette='Set1')
plt.show()


# ###### Exploratory Data Analysis
# 

# In[ ]:


plt.figure(figsize=(12,5))
plt.rc("font", size=14)
sns.countplot(x='Department',hue='Attrition',data=data, palette='Set1', color='Green')
plt.title("Attrition with respect to Department")
plt.show()


# In[ ]:


plt.figure(figsize=(12,5))

sns.countplot(x='EducationField',hue='Attrition',data=data, palette='Set1', color='Green')
plt.title("Attrition with respect to EducationField")
plt.xticks(rotation=45)
plt.show()


# In[ ]:


plt.figure(figsize=(12,5))

sns.countplot(x='JobRole',hue='Attrition',data=data, palette='Set1')
plt.title("JobRole with respect to Attrition")
plt.legend(loc='best')
plt.xticks(rotation=45)
plt.show()


# In[ ]:


plt.figure(figsize=(12,5))
sns.countplot(x='Gender',hue='Attrition',data=data, palette='Set1')
plt.title("Gender with respect to Attrition")
plt.legend(loc='best')
plt.show()


# In[ ]:


plt.figure(figsize=(12,5))
sns.distplot(data['Age'],hist=False)
plt.show()


# In[ ]:


ordinal_features = ['Education','EnvironmentSatisfaction','JobInvolvement','JobSatisfaction',
                   'PerformanceRating','RelationshipSatisfaction','WorkLifeBalance']
data[ordinal_features].head()


# In[ ]:


edu_map = {1 : 'Below College', 2: 'College', 3 : 'Bachelor', 4 :'Master', 5: 'Doctor'}
plt.figure(figsize=(12,5))
sns.countplot(x=data['Education'].map(edu_map), hue='Attrition', data=data, palette='Set1')
plt.title("Education with respect to Attrition")
plt.show()


# ###### Label Encoding
# 

# In[ ]:


data['Attrition'] = data['Attrition'].replace({'No':0,'Yes':1})


# In[ ]:


data['OverTime'] = data['OverTime'].map({'No':0,'Yes':1})
data['Gender'] = data['Gender'].map({'Male':0,'Female':1})


# In[ ]:


data["Gender"].value_counts()


# In[ ]:


data['Over18'] = data['Over18'].map({'Y':1,'No':0})


# In[ ]:


from sklearn.preprocessing import LabelEncoder
encoding_cols=['BusinessTravel','Department','EducationField','JobRole','MaritalStatus']
label_encoders = {}
for column in encoding_cols:
    label_encoders[column] = LabelEncoder()
    data[column] = label_encoders[column].fit_transform(data[column])


# In[ ]:


data.head()


# In[ ]:


data.info()


# In[ ]:


X = data.drop(['Attrition'], axis=1)
y = data['Attrition'].values


# ###### Resampling

# In[ ]:


from collections import Counter
from imblearn.over_sampling import RandomOverSampler
print(Counter(y))
rus = RandomOverSampler(random_state = 42)
X_over, y_over = rus.fit_resample(X,y)
print(Counter(y_over))


# In[ ]:


from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X_over, y_over, test_size=0.2, random_state=42)


# In[ ]:


print(X_train.shape)
print(y_train.shape)
print(X_test.shape)
print(y_test.shape)


# ###### Logestic Regression

# In[ ]:


from sklearn.preprocessing import StandardScaler
std=StandardScaler()


# In[ ]:


X_train_std=std.fit_transform(X_train)
X_test_std=std.transform(X_test)


# In[ ]:


import pickle
import os


# In[ ]:


scaler_path=os.path.join('C:/Users/hp/Desktop/employeeAttrition/','models/scaler.pkl')
with open(scaler_path,'wb') as scaler_file:
    pickle.dump(std,scaler_file)


# In[ ]:


X_train_std


# In[ ]:


X_test_std


# ###### Decision Tree

# In[ ]:


from sklearn.tree import DecisionTreeClassifier
dt=DecisionTreeClassifier()


# In[ ]:


dt.fit(X_train_std,y_train)


# In[ ]:


Y_pred=dt.predict(X_test_std)


# In[ ]:


from sklearn.metrics import accuracy_score


# In[ ]:


ac_dt=accuracy_score(y_test,Y_pred)


# In[ ]:


ac_dt


# In[ ]:


import joblib
model_path=os.path.join('C:/Users/hp/Desktop/employeeAttrition/','models/dt.sav')
joblib.dump(dt,model_path)


# In[ ]:


prediction = dt.predict(X_test)
cnf_matrix = confusion_matrix(y_test,prediction)
print("Accuracy Score -", accuracy_score(y_test , prediction))


# In[ ]:


X_train.columns


# In[ ]:


fig = plt.figure(figsize = (15,6))
ax1 = fig.add_subplot(1,2,1)
ax1 = sns.heatmap(pd.DataFrame(cnf_matrix), annot = True, cmap = 'Blues', fmt = 'd')
bottom, top = ax1.get_ylim()
ax1.set_ylim(bottom + 0.5, top - 0.5)
plt.xlabel('Predicted')
plt.ylabel('Expected')

ax2 = fig.add_subplot(1,2,2)
y_pred_proba = dt.predict_proba(X_test)[::,1]
fpr, tpr, _ = roc_curve(y_test, prediction)
auc = roc_auc_score(y_test, prediction)
ax2 = plt.plot(fpr,tpr,label = "data 1 auc="+str(auc))
plt.legend(loc=4)
plt.show()


# ###### Random Forest

# In[ ]:


from sklearn.ensemble import RandomForestClassifier
rf=RandomForestClassifier()


# In[ ]:


rf.fit(X_train, y_train)


# In[ ]:


prediction = rf.predict(X_test)
cnf_matrix = confusion_matrix(y_test,prediction)
print("Accuracy Score -", accuracy_score(y_test , prediction))


# In[ ]:


fig = plt.figure(figsize = (15,6))
ax1 = fig.add_subplot(1,2,1)
ax1 = sns.heatmap(pd.DataFrame(cnf_matrix), annot = True, cmap = 'Blues', fmt = 'd')
bottom, top = ax1.get_ylim()
ax1.set_ylim(bottom + 0.5, top - 0.5)
plt.xlabel('Predicted')
plt.ylabel('Expected')

ax2 = fig.add_subplot(1,2,2)
y_pred_proba = rf.predict_proba(X_test)[::,1]
fpr, tpr, _ = roc_curve(y_test, prediction)
auc = roc_auc_score(y_test, prediction)
ax2 = plt.plot(fpr,tpr,label = "data 1 auc="+str(auc))
plt.legend(loc=4)
plt.show()


# In[ ]:




