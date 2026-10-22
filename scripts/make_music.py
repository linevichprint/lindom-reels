"""Synthesizes a reel soundtrack. Every style runs at 120 BPM so cuts land on beats (1 beat = 0.5s = 15 frames).
usage: make_music.py <out.wav> <end-card time, s> [snap time(s), s, comma-separated | -] [pop|bounce|funk|lofi|dream|swing|chip|house|clicky] [transpose]"""
import numpy as np, wave, sys
SR=44100; BEAT=0.5; S16=BEAT/4
END=float(sys.argv[2])                                              # end card (must land on a beat)
SNAPS=[float(x) for x in sys.argv[3].split(',')] if len(sys.argv)>3 and sys.argv[3]!='-' else []
SNAP=SNAPS[0] if len(SNAPS)==1 else None   # a single snap gets a riser + drop-out; several get impacts only
STYLE=sys.argv[4] if len(sys.argv)>4 else 'pop'
DUR=END+4.0
n=int(SR*DUR); out=np.zeros(n)
rng=np.random.default_rng(7)
def add(sig,t,g=1.0):
    i=int(t*SR); j=min(n,i+len(sig))
    if 0<=i<n: out[i:j]+=sig[:j-i]*g
def env(l,a=0.005,d=0.3):
    t=np.arange(int(l*SR))/SR
    return np.minimum(t/a,1)*np.exp(-t/d)
TR=int(sys.argv[5]) if len(sys.argv)>5 else 0   # transpose, semitones
def f(m): return 440*2**((m-69+TR)/12)
def pluck(m,l=0.6,d=0.18):
    t=np.arange(int(l*SR))/SR; fr=f(m)
    s=np.sin(2*np.pi*fr*t)+0.35*np.sin(2*np.pi*2*fr*t)*np.exp(-t/0.08)+0.15*np.sin(2*np.pi*3*fr*t)*np.exp(-t/0.04)
    return s*env(l,0.003,d)
def marimba(m,l=0.5):
    t=np.arange(int(l*SR))/SR; fr=f(m)
    return (np.sin(2*np.pi*fr*t)*np.exp(-t/0.12)+0.4*np.sin(2*np.pi*4*fr*t)*np.exp(-t/0.02))*np.minimum(t/0.002,1)
def stab(ms,l=0.16):
    t=np.arange(int(l*SR))/SR
    s=sum(sum(np.sin(2*np.pi*f(m)*k*t)/k for k in (1,2,3,4,5)) for m in ms)/len(ms)
    return s*np.minimum(t/0.003,1)*np.exp(-t/0.05)
def epiano(m,l=1.8):
    t=np.arange(int(l*SR))/SR; fr=f(m)
    s=np.sin(2*np.pi*fr*t+0.8*np.sin(2*np.pi*fr*t)*np.exp(-t/0.3))
    return s*np.minimum(t/0.006,1)*np.exp(-t/0.7)*(1+0.12*np.sin(2*np.pi*4.5*t))
def pad(ms,l):
    t=np.arange(int(l*SR))/SR; s=sum(np.sin(2*np.pi*f(m)*t)+0.3*np.sin(2*np.pi*f(m)*1.003*t*2) for m in ms)
    e=np.minimum(t/0.25,1)*np.minimum((l-t)/0.4,1)
    return s*e/len(ms)
def kick(d=0.11):
    t=np.arange(int(0.32*SR))/SR; ph=2*np.pi*(48*t+(120/28)*(1-np.exp(-28*t)))
    return np.sin(ph)*np.exp(-t/d)
def clap():
    l=int(0.22*SR); x=rng.standard_normal(l); x=np.diff(x,prepend=0); x=np.convolve(x,np.ones(6)/6,'same')
    t=np.arange(l)/SR; e=np.exp(-t/0.06)+0.6*np.exp(-np.abs(t-0.012)/0.004)+0.5*np.exp(-np.abs(t-0.024)/0.004)
    return x*e
def snare():
    l=int(0.25*SR); t=np.arange(l)/SR; x=np.convolve(rng.standard_normal(l),np.ones(4)/4,'same')
    return x*np.exp(-t/0.07)*0.7+np.sin(2*np.pi*185*t)*np.exp(-t/0.05)
def hat(d=0.03):
    l=int(0.25*SR); x=rng.standard_normal(l); x=np.diff(np.diff(x,prepend=0),prepend=0)
    return x*np.exp(-np.arange(l)/SR/d)
def square(m,l=0.12,d=0.06):
    t=np.arange(int(l*SR))/SR
    return np.sign(np.sin(2*np.pi*f(m)*t))*np.minimum(t/0.002,1)*np.exp(-t/d)
def tri(m,l):
    t=np.arange(int(l*SR))/SR; ph=(f(m)*t)%1
    return (4*np.abs(ph-0.5)-1)*np.minimum(t/0.004,1)*np.minimum((l-t)/0.02,1)
def rim():
    t=np.arange(int(0.05*SR))/SR
    return (np.sin(2*np.pi*1800*t)+0.5*np.sin(2*np.pi*2700*t))*np.exp(-t/0.008)
def bass(m,l):
    t=np.arange(int(l*SR))/SR; fr=f(m)
    return (np.sin(2*np.pi*fr*t)+0.25*np.sin(2*np.pi*2*fr*t))*np.minimum(t/0.01,1)*np.exp(-t/(l*0.9))

STYLES={
 'clickonly': dict(ch=[[60,64,67,71]]*4, root=[36]*4),
 'pop':   dict(ch=[[65,69,72,76],[67,71,74,76],[64,67,71,74],[69,72,76,79]], root=[41,43,40,45]),
 'bounce':dict(ch=[[60,64,67,72],[59,62,67,71],[57,60,64,69],[53,57,60,65]], root=[36,43,45,41]),
 'funk':  dict(ch=[[57,60,64,67],[62,66,69,72],[53,57,60,64],[52,56,59,62]], root=[45,38,41,40]),
 'lofi':  dict(ch=[[62,65,69,72],[55,59,62,65],[60,64,67,71],[57,61,64,67]], root=[38,43,36,45]),
 'dream': dict(ch=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]], root=[36,33,29,31]),
 'swing': dict(ch=[[60,64,67,69],[57,61,64,67],[62,65,69,72],[55,59,62,65]], root=[36,33,38,31]),
 'chip':  dict(ch=[[69,72,76],[65,69,72],[60,64,67],[67,71,74]], root=[45,41,36,43]),
 'house': dict(ch=[[65,68,72,75],[61,65,68,72],[68,72,75,79],[63,67,70,74]], root=[41,37,44,39]),
 'clicky':dict(ch=[[60,64,67,71],[57,60,64,67],[60,64,67,71],[53,57,60,64]], root=[36,33,36,29]),
}
CH=STYLES[STYLE]['ch']; ROOT=STYLES[STYLE]['root']
def live(t): return t<END and not (SNAP and SNAP-1.0<=t<SNAP)   # drop-out before the snap

for bar in (range(0) if STYLE=='clickonly' else range(int(END//2)+1)):
    t0=bar*2.0; c=CH[bar%4]; r=ROOT[bar%4]
    full = t0>=(SNAP-1.0 if SNAP else 2.0)   # full groove after the snap / the hook
    at=lambda s: t0+s*S16                      # position in 16th notes within the bar
    if STYLE=='pop':
        add(pad(c,2.0), t0, 0.10 if full else 0.07)
        for k,a in enumerate([0,2,1,3,2,1,3,2]):
            if at(k*2)<END: add(pluck(c[a]+12,d=0.16), at(k*2), 0.22 if full else 0.17)
        for b in range(4):
            t=at(b*4)
            if not live(t): continue
            if full or b in (0,2): add(kick(), t, 0.85)
            if full and b in (1,3): add(clap(), t, 0.30)
            add(hat(), t+BEAT/2, 0.05 if full else 0.035)
            if full: add(hat(0.015), t+BEAT/4, 0.02); add(hat(0.015), t+3*BEAT/4, 0.02)
            if b in (0,2) or full: add(bass(r+(12 if (b==3 and full) else 0), BEAT*0.95), t, 0.33)
    elif STYLE=='bounce':   # playful marimba riff, octave-bouncing bass
        riff=[(0,3),(2,2),(3,3),(6,1),(8,2),(10,3),(11,2),(14,0)]
        for s,a in riff:
            if at(s)<END: add(marimba(c[a]+12), at(s), 0.30 if full else 0.24)
        if bar%2==1 and full:
            for i,s in enumerate((12,13,14,15)):
                if at(s)<END: add(marimba(c[i%4]+24,0.3), at(s), 0.10)
        for s in range(16):
            t=at(s)
            if not live(t): continue
            if s in (0,6,8) or (full and s==14): add(kick(0.09), t, 0.8)
            if full and s in (4,12): add(clap(), t, 0.28)
            add(hat(0.012), t, 0.03 if s%2 else 0.018)            # shaker
            if s%2==0 and (full or s%8==0): add(bass(r+(12 if s%4==2 else 0), BEAT*0.45), t, 0.30)
    elif STYLE=='funk':     # off-beat stabs, syncopated bass
        for s in (2,6,10,14):
            if at(s)<END and (full or s in (2,10)): add(stab(c), at(s), 0.16)
        for s,dn in ((0,0),(3,0),(6,7),(8,0),(10,12),(14,10)):
            if live(at(s)) and (full or s in (0,8)): add(bass(r+dn, S16*1.6), at(s), 0.36)
        for s in range(16):
            t=at(s)
            if not live(t): continue
            if s in (0,6,8) : add(kick(0.08), t, 0.8)
            if full and s==11: add(kick(0.08), t, 0.5)
            if full and s in (4,12): add(clap(), t, 0.3); add(snare(), t, 0.12)
            if s%2==0: add(hat(0.02 if s!=14 else 0.09), t, 0.04)
            elif full: add(hat(0.01), t, 0.015)
        if full and bar%2==1 and at(12)<END:
            for i,m in enumerate((c[3]+12,c[2]+12,c[1]+12)): add(pluck(m,0.3,0.08), at(12+i), 0.14)
    elif STYLE=='lofi':     # half-time drums, electric piano, swung hats
        for s in (0,7):
            if at(s)<END:
                for i,m in enumerate(c): add(epiano(m), at(s)+i*0.012, 0.11 if s==0 else 0.07)
        if at(10)<END and full: add(epiano(c[-1]+12,1.2), at(10), 0.10)
        if at(13)<END and full and bar%2==1: add(epiano(c[1]+12,1.0), at(13), 0.08)
        for s in range(16):
            t=at(s)
            if not live(t): continue
            if s in (0,10) or (full and s==7): add(kick(0.14), t, 0.75)
            if s==8 and full: add(snare(), t, 0.22); add(clap(), t, 0.10)
            if s%4==2: add(hat(0.02), t+S16*0.35, 0.035)          # swung off-beat
            if full and s%4==0: add(hat(0.012), t, 0.02)
        if live(t0): add(bass(r, 1.4), t0, 0.36)
        if live(at(10)) and full: add(bass(r+7, 0.6), at(10), 0.25)
    elif STYLE=='dream':    # airy bell arpeggio over a wide pad, almost no drums
        add(pad([m+12 for m in c],2.0), t0, 0.16); add(pad(c,2.0), t0, 0.08)
        for s in range(0,16,2 if not full else 1):
            a=[0,1,2,3,2,3,1,2,0,2,1,3,2,1,3,2][s]
            if at(s)<END: add(pluck(c[a]+(24 if s%4==3 else 12),1.2,0.45), at(s), 0.13 if s%2==0 else 0.07)
        if live(t0): add(bass(r,1.9), t0, 0.34); add(kick(0.16), t0, 0.5)
        if full and live(at(8)): add(kick(0.16), at(8), 0.35)
        if full:
            for s in range(2,16,4):
                if live(at(s)): add(hat(0.012), at(s), 0.018)
    elif STYLE=='swing':    # swung comping, walking bass, ride pattern
        T=BEAT/3
        for b in range(4):
            t=t0+b*BEAT
            if not live(t): continue
            add(bass(c[b%len(c)]-24 if b<3 else r+11, BEAT*0.9), t, 0.36)                 # walking bass
            add(hat(0.04), t, 0.035)                                                       # ride: ding, ding-a-ding
            if b in (1,3): add(hat(0.03), t+2*T, 0.025); add(snare(), t, 0.10 if full else 0.05)
            if b==0: add(kick(0.1), t, 0.55)
            if b in (1,3) and (full or b==1):
                for i,m in enumerate(c): add(epiano(m,0.5), t+2*T+i*0.006, 0.09)           # off-beat stab
        if full:
            mel=[(0,3),(1.667,2),(2,3),(3.667,1)] if bar%2==0 else [(0.667,2),(1,3),(2.667,2),(3,0)]
            for b,a in mel:
                if t0+b*BEAT<END: add(marimba(c[a]+12,0.4), t0+b*BEAT, 0.20)
    elif STYLE=='chip':     # 8-bit: square-wave arps, triangle bass, noise drums
        for s in range(16):
            t=at(s)
            if t<END: add(square(c[s%3]+(12 if (s//3)%2 else 0)), t, 0.055 if full else 0.04)
            if not live(t): continue
            if s%2==0: add(tri(r+(12 if s%8==6 else 0), S16*1.8), t, 0.30)
            if s in (0,8) or (full and s in (6,10)): add(kick(0.07), t, 0.7)
            if full and s in (4,12): add(hat(0.05), t, 0.07)
            if s%2==1 and full: add(hat(0.008), t, 0.02)
        if full:
            lead=[(0,2,3),(3,1,2),(6,2,2),(8,0,4),(12,1,2),(14,2,2)] if bar%2==0 else [(0,0,2),(2,1,2),(4,2,4),(8,1,3),(11,2,5)]
            for s,a,ln in lead:
                if at(s)<END: add(square(c[a]+12, S16*ln, S16*ln*0.6), at(s), 0.075)
    elif STYLE=='house':    # four-on-the-floor, off-beat organ and bass
        for b in range(4):
            t=t0+b*BEAT
            if not live(t): continue
            add(kick(0.1), t, 0.9)
            add(hat(0.06 if full else 0.03), t+BEAT/2, 0.05)
            if full and b in (1,3): add(clap(), t, 0.3)
            add(bass(r, BEAT*0.42), t+BEAT/2, 0.38)
            if full or b%2==1: add(stab(c,0.22), t+BEAT/2, 0.13)
            if full: add(hat(0.01), t+BEAT/4, 0.015); add(hat(0.01), t+3*BEAT/4, 0.015)
        if full and bar%4==3 and at(12)<END:
            for i in range(4): add(snare(), at(12+i), 0.06+0.03*i)
    elif STYLE=='clicky':   # minimal: soft pad, rim clicks, room for the snap sounds
        add(pad(c,2.0), t0, 0.10)
        for s in (2,6,10,14):
            if live(at(s)): add(rim(), at(s), 0.10)
        for s in (5,13):
            if live(at(s)): add(rim(), at(s), 0.05)
        for s,a in ((0,0),(6,2),(12,3)):
            if at(s)<END: add(pluck(c[a]+12,0.8,0.25), at(s), 0.12)
        if live(at(8)): add(bass(r+12,0.5), at(8), 0.22)
if STYLE=='lofi':           # tape warmth + vinyl crackle
    out=np.convolve(out,np.ones(7)/7,'same')
    cr=(rng.random(n)>0.9996)*rng.standard_normal(n)*0.25
    out+=np.convolve(cr,np.exp(-np.arange(40)/6),'same')*0.3*(np.arange(n)/SR<END)

if SNAP:
    # riser into the snap
    l=int(1.0*SR); t=np.arange(l)/SR; x=rng.standard_normal(l); x=np.diff(x,prepend=0)
    add(x*(t/1.0)**2.5, SNAP-1.0, 0.10)
    add(np.sin(2*np.pi*(300*t+400*t*t))*(t/1.0)**2, SNAP-1.0, 0.05)
    # snap impact: click + sub boom
    l=int(0.9*SR); t=np.arange(l)/SR
    add(np.sin(2*np.pi*(40*t+(90/14)*(1-np.exp(-14*t))))*np.exp(-t/0.3), SNAP, 0.9)
    c=rng.standard_normal(int(0.03*SR)); add(np.diff(c,prepend=0)*np.exp(-np.arange(len(c))/SR/0.004), SNAP, 0.5)
    add(pluck(88,0.8,0.3), SNAP, 0.25); add(pluck(84,0.8,0.3), SNAP, 0.2)
for T0 in (SNAPS if (len(SNAPS)>1 and STYLE=='clickonly') else []):   # dry plastic click, no music
    l=int(0.12*SR); t=np.arange(l)/SR
    c=rng.standard_normal(l); c=np.diff(c,prepend=0)
    add(c*np.exp(-t/0.006), T0, 0.9)
    add(np.sin(2*np.pi*2300*t)*np.exp(-t/0.01), T0, 0.35)
    add(np.sin(2*np.pi*(90*t))*np.exp(-t/0.05), T0+0.004, 0.5)
for T0 in (SNAPS if (len(SNAPS)>1 and STYLE!='clickonly') else []):   # impacts only: click + sub boom + bell
    l=int(0.9*SR); t=np.arange(l)/SR
    add(np.sin(2*np.pi*(40*t+(90/14)*(1-np.exp(-14*t))))*np.exp(-t/0.3), T0, 0.9)
    c=rng.standard_normal(int(0.03*SR)); add(np.diff(c,prepend=0)*np.exp(-np.arange(len(c))/SR/0.004), T0, 0.6)
    add(pluck(84+SNAPS.index(T0)*2,0.9,0.3), T0, 0.22)
if STYLE=='clickonly': END=-1
# end card: final chord ring-out
voice={'bounce':lambda m,l,d: marimba(m,l)+0.5*pluck(m,l,d),'lofi':lambda m,l,d: epiano(m,l),'swing':lambda m,l,d: epiano(m,l),'chip':lambda m,l,d: square(m,l,d)*0.35}.get(STYLE,pluck)
for m in ([] if END<0 else [ROOT[0],ROOT[0]+12])+[x+ (0 if STYLE=='lofi' else 0) for x in CH[0]]+[CH[0][0]+12]: add(voice(m,3.0,0.9), END, 0.20 if STYLE!='lofi' else 0.14)
if END>=0: add(kick(), END, 0.9); add(clap(), END, 0.25)
if STYLE not in ('lofi','clickonly'):
    for i,m in enumerate([CH[0][0]+12,CH[0][1]+12,CH[0][2]+12,CH[0][0]+24]): add(voice(m,1.5,0.4), END+0.5+i*0.125, 0.12)
# master
out=np.tanh(out*1.3)*0.89
fade=int(1.2*SR); out[-fade:]*=np.linspace(1,0,fade)
L=out; R=np.concatenate([np.zeros(300),out[:-300]])*0.97   # light stereo widening
st=np.stack([L,R],1)
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st*32767).astype('<i2').tobytes()); w.close()
