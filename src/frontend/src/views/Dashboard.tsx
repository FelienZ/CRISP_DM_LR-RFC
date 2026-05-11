import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import gsap from 'gsap';
import { HeartPulse, Activity, AlertCircle } from 'lucide-react';

import { usePredict } from '../hooks/usePredict';
import type { HeartDiseaseRequest } from '../types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

const formSchema = z.object({
  Age: z.coerce.number().min(1, "Required").max(120),
  Gender: z.enum(['Male', 'Female']),
  ChestPain: z.enum(['Typical', 'Atypical', 'Non-anginal', 'Asymptomatic']),
  RestingBP: z.coerce.number().min(50).max(250),
  Cholesterol: z.coerce.number().min(0).max(600),
  FastingBS: z.coerce.number(),
  MaxHR: z.coerce.number().min(50).max(250),
  ExerciseAngina: z.enum(['Yes', 'No']),
  Smoking: z.enum(['Yes', 'No']),
  BMI: z.coerce.number().min(10).max(60),
  FamilyHistory: z.enum(['Yes', 'No']),
  StressLevel: z.coerce.number().min(1).max(10),
  PhysicalActivity: z.enum(['Rendah', 'Sedang', 'Tinggi']),
  model_type: z.enum(['lr', 'rf']),
});

type FormValues = z.infer<typeof formSchema>;

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { mutate: predict, data: result, isPending, isError, error } = usePredict();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      Age: 50,
      Gender: 'Male',
      ChestPain: 'Asymptomatic',
      RestingBP: 120,
      Cholesterol: 200,
      FastingBS: 0,
      MaxHR: 150,
      ExerciseAngina: 'No',
      Smoking: 'No',
      BMI: 25.0,
      FamilyHistory: 'No',
      StressLevel: 5,
      PhysicalActivity: 'Sedang',
      model_type: 'rf'
    }
  });

  useEffect(() => {
    // GSAP Entrance Animation
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" });

      if (formRef.current) {
        const elements = formRef.current.querySelectorAll('.stagger-item');
        gsap.from(elements, {
          opacity: 0,
          y: 10,
          stagger: 0.05,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.3
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const onSubmit = (data: FormValues) => {
    predict(data as unknown as HeartDiseaseRequest);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-primary/30">
      <div ref={containerRef} className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Form Section */}
        <Card className="lg:col-span-8 shadow-xl relative overflow-hidden">
          <CardHeader className="pb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <HeartPulse className="w-10 h-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">CardioRisk ML Diagnostic</CardTitle>
                <CardDescription className="text-base mt-1">Enter patient clinical metrics for real-time risk assessment.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">

                <div className="stagger-item space-y-2">
                  <Label htmlFor="Age">Age</Label>
                  <Input id="Age" type="number" {...register('Age')} />
                  {errors.Age && <span className="text-xs text-destructive">{errors.Age.message}</span>}
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="Gender">Gender</Label>
                  <select id="Gender" {...register('Gender')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="ChestPain">Chest Pain Type</Label>
                  <select id="ChestPain" {...register('ChestPain')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="Typical">Typical Angina</option>
                    <option value="Atypical">Atypical Angina</option>
                    <option value="Non-anginal">Non-anginal</option>
                    <option value="Asymptomatic">Asymptomatic</option>
                  </select>
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="RestingBP">Resting BP (mmHg)</Label>
                  <Input id="RestingBP" type="number" {...register('RestingBP')} />
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="Cholesterol">Cholesterol</Label>
                  <Input id="Cholesterol" type="number" {...register('Cholesterol')} />
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="MaxHR">Max HR Achieved</Label>
                  <Input id="MaxHR" type="number" {...register('MaxHR')} />
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="BMI">BMI</Label>
                  <Input id="BMI" type="number" step="0.1" {...register('BMI')} />
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="StressLevel">Stress Level (1-10)</Label>
                  <Input id="StressLevel" type="number" {...register('StressLevel')} />
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="PhysicalActivity">Physical Activity</Label>
                  <select id="PhysicalActivity" {...register('PhysicalActivity')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="FastingBS">Fasting BS &gt; 120</Label>
                  <select id="FastingBS" {...register('FastingBS')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="0">False (0)</option>
                    <option value="1">True (1)</option>
                  </select>
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="ExerciseAngina">Exercise Angina</Label>
                  <select id="ExerciseAngina" {...register('ExerciseAngina')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="Smoking">Smoking</Label>
                  <select id="Smoking" {...register('Smoking')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="stagger-item space-y-2">
                  <Label htmlFor="FamilyHistory">Family History</Label>
                  <select id="FamilyHistory" {...register('FamilyHistory')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="stagger-item space-y-2 sm:col-span-2 border-t pt-6 mt-4">
                  <Label htmlFor="model_type" className="text-primary font-semibold tracking-wide uppercase text-xs">AI Inference Engine Switcher</Label>
                  <select id="model_type" {...register('model_type')} className="flex h-12 w-full rounded-md border-2 border-primary/30 bg-primary/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer mt-2 font-medium">
                    <option value="rf">Random Forest Classifier (Primary)</option>
                    <option value="lr">Logistic Regression (Baseline)</option>
                  </select>
                </div>
              </div>

              <div className="stagger-item pt-6">
                <Button type="submit" disabled={isPending} className="w-full h-14 text-lg rounded-xl shadow-lg transition-all">
                  {isPending ? 'Processing Matrix...' : 'Execute Diagnostic Analysis'}
                </Button>
              </div>

              {isError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive mt-4">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <p className="text-sm font-medium">Error: {error?.message || "Failed to connect to backend API."}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Results Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-xl overflow-hidden relative h-full flex flex-col">
            <CardHeader className="bg-muted/30 border-b pb-6">
              <CardTitle className="text-xl">Inference Results</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-8 z-10">
              {!result && !isPending && (
                <div className="text-muted-foreground flex flex-col items-center gap-4">
                  <Activity className="w-16 h-16 opacity-20" />
                  <p className="text-base font-medium">Awaiting clinical parameters to commence analysis...</p>
                </div>
              )}

              {isPending && (
                <div className="animate-pulse flex flex-col items-center gap-5 text-primary">
                  <HeartPulse className="w-16 h-16 animate-bounce" />
                  <p className="text-base font-medium">Synthesizing prediction via chosen engine...</p>
                </div>
              )}

              {result && !isPending && (
                <div className="w-full space-y-10 animate-in fade-in zoom-in duration-500">
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                      Model: <span className="text-primary">{result.model_used}</span>
                    </p>
                    <Badge variant={result.prediction === 1 ? 'destructive' : 'default'} className={`text-base px-8 py-3 shadow-lg ${result.prediction === 0 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'}`}>
                      {result.risk_level}
                    </Badge>
                  </div>

                  <div className="space-y-3 bg-muted/40 p-5 rounded-2xl border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Confidence Score</span>
                      <span className="font-mono font-bold text-base">{(result.probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-4 border overflow-hidden relative">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${result.prediction === 1 ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                        style={{ width: `${result.probability * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-card rounded-xl text-left border shadow-sm">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.prediction === 1
                        ? "Diagnostic ML models have identified significant patterns correlating with cardiovascular events. Prompt clinical intervention recommended."
                        : "No acute cardiovascular risk patterns detected based on current vitals and historical ML data distributions."}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
