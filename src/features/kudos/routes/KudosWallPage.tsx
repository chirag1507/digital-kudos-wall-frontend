import React, { useState, useEffect } from "react";
import KudosCard, { Kudo } from "../components/KudosCard";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import Grid from "@mui/material/Grid";

const mockKudos: Kudo[] = [
  {
    id: "1",
    category: "Well Done",
    to: "Sarah Chen",
    toProfilePicture: "https://i.pravatar.cc/150?u=sarah",
    message: "Outstanding work on the Q1 campaign!",
    from: "Michael Thompson",
    fromProfilePicture: "https://i.pravatar.cc/150?u=michael",
    date: "Mar 15, 2025",
  },
  {
    id: "2",
    category: "Great Teamwork",
    to: "David Kumar",
    toProfilePicture: "https://i.pravatar.cc/150?u=david",
    message: "Incredible job debugging the production issue!",
    from: "Emily Rodriguez",
    fromProfilePicture: "https://i.pravatar.cc/150?u=emily",
    date: "Mar 14, 2025",
  },
  {
    id: "3",
    category: "Proud of You",
    to: "Lisa Park",
    toProfilePicture: "https://i.pravatar.cc/150?u=lisa",
    message: "Phenomenal work closing the enterprise deal!",
    from: "James Wilson",
    fromProfilePicture: "https://i.pravatar.cc/150?u=james",
    date: "Mar 13, 2025",
  },
];

const KudosWallPage: React.FC = () => {
  const [kudos, setKudos] = useState<Kudo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In the future, we'll fetch this from an API
    setTimeout(() => {
      setKudos(mockKudos);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kudos Wall
      </Typography>
      <Grid container spacing={2}>
        {kudos.map((kudo) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={kudo.id}>
            <KudosCard kudo={kudo} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default KudosWallPage;
