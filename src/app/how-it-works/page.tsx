import Link from "next/link";
import { Search, CalendarCheck, Video, PlusCircle } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Find Your Studio",
        description: "Explore available studios and choose the perfect space for your creative needs.",
    },
    {
        icon: CalendarCheck,
        title: "Book Your Space",
        description: "Check studio details, pricing and submit your booking request.",
    },
    {
        icon: Video,
        title: "Start Creating",
        description: "Visit your booked studio and bring your creative ideas to life.",
    },
];

const HowItWorkPage = () => {
    return (
        <main className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <p className="text-sm font-semibold text-primary mb-2">
                    SIMPLE PROCESS
                </p>
                <h1 className="text-3xl md:text-4xl font-bold">
                    How StudioSpace Works
                </h1>
                <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                    Find, book, and create in the perfect studio space.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.title}
                            className="border rounded-2xl p-7 text-center hover:shadow-lg transition"
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                                <Icon size={27} />
                            </div>

                            <p className="text-sm text-primary font-semibold mb-2">
                                STEP 0{index + 1}
                            </p>

                            <h2 className="text-xl font-semibold mb-3">
                                {step.title}
                            </h2>

                            <p className="text-sm text-muted-foreground leading-6">
                                {step.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 rounded-2xl bg-muted/50 p-8 text-center">
                <PlusCircle className="mx-auto mb-3 text-primary" size={30} />

                <h2 className="text-2xl font-bold">
                    Have a Studio to Share?
                </h2>

                <p className="text-muted-foreground mt-2 mb-5">
                    List your studio and connect with creative people.
                </p>

                <Link
                    href="/explore"
                    className="inline-flex px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                >
                    List Your Studio
                </Link>
            </div>
        </main>
    );
};

export default HowItWorkPage;